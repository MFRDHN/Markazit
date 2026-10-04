<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicantResource;
use App\Mail\ApplicantConfirmation;
use App\Models\Applicant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ApplicantController extends Controller
{
    // ponytail: no-cache headers for file serving (prevents stale photo showing)
    private const NO_CACHE = [
        'Cache-Control' => 'no-cache, no-store, must-revalidate, private',
        'Pragma' => 'no-cache',
        'Expires' => '0',
    ];

    private function ensureAdmin(): void
    {
        abort_unless(auth()->user()?->role === 'admin', 403);
    }

    /**
     * Display a listing of applicants (admin only).
     */
    public function index(Request $request)
    {
        $this->ensureAdmin();
        $query = Applicant::with(['payments', 'user'])->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = addcslashes($request->search, '\\%_');
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $applicants = $query->paginate($request->get('per_page', 15));

        return ApplicantResource::collection($applicants);
    }

    /**
     * Store a newly created applicant (public). Creates user account + applicant stub.
     * ponytail: only email + password; user fills profile later in dashboard.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email'), Rule::unique('applicants', 'email')],
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Max 2 registrations per network; 3rd attempt gets blocked and logged.
        // ponytail: CGNAT/mobile ISPs rotate the public IP every session
        // (e.g. ...92.236 -> .238 -> .239), so counting the exact IP never
        // trips. We count the whole IPv4 /24 (or IPv6 /64) block instead —
        // still a speed bump, not identity.
        $ip = $request->ip();
        $block = str_contains($ip, ':')
            ? implode(':', array_slice(explode(':', $ip), 0, 4))
            : implode('.', array_slice(explode('.', $ip), 0, 3));
        if (User::where('registrasi_ip', 'like', "{$block}%")->count() >= 2) {
            Log::warning('Registration blocked: IP limit reached', [
                'ip' => $ip,
                'email' => $validated['email'],
            ]);
            return response()->json([
                'message' => 'Pendaftaran gagal. Silakan hubungi admin untuk proses pendaftaran.',
            ], 429);
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => explode('@', $validated['email'])[0],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'applicant',
                'registrasi_ip' => $ip,
            ]);

            // ponytail: minimal applicant stub; user fills rest in dashboard
            $applicant = Applicant::create([
                'user_id' => $user->id,
                'nama' => explode('@', $validated['email'])[0],
                'usia' => 18,
                // ponytail: unique per user to satisfy DB unique constraint
                'no_hp' => '-' . $user->id,
                'email' => $validated['email'],
                'status' => 'pending',
            ]);

            DB::commit();

            $token = $user->createToken('applicant-token')->plainTextToken;

            return response()->json([
                'message' => 'Pendaftaran berhasil!',
                'token' => $token,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Applicant registration failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Gagal mendaftar. Silakan coba lagi.',
            ], 422);
        }
    }

    /**
     * Show own applicant data (authenticated user).
     */
    public function showOwn(Request $request)
    {
        $applicant = $request->user()->applicant;
        if (!$applicant) {
            return response()->json([
                'message' => 'Data pendaftar tidak ditemukan. Silakan daftar terlebih dahulu.',
            ], 404);
        }
        return new ApplicantResource($applicant->load('payments'));
    }

    /**
     * Update own applicant data (authenticated user).
     */
    public function updateOwn(Request $request)
    {
        $user = $request->user();
        $applicant = $user->applicant;

        if (!$applicant) {
            return response()->json(['message' => 'Data pendaftar tidak ditemukan.'], 404);
        }

        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'usia' => 'sometimes|required|integer|min:15|max:45',
            'no_hp' => ['sometimes', 'required', 'string', 'max:20', Rule::unique('applicants', 'no_hp')->ignore($applicant->id)],
            // Email must be free on BOTH tables — login authenticates against users
            'email' => [
                'sometimes', 'required', 'email', 'max:255',
                Rule::unique('applicants', 'email')->ignore($applicant->id),
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'motivasi' => 'nullable|string',
            'dokumen_ktp' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'dokumen_kk' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'dokumen_paspor' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'foto' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        try {
            DB::beginTransaction();

            $fileFields = ['dokumen_ktp', 'dokumen_kk', 'dokumen_paspor', 'foto'];
            foreach ($fileFields as $field) {
                if ($request->hasFile($field)) {
                    // Delete old file
                    if ($applicant->$field) {
                        Storage::disk('local')->delete($applicant->$field);
                    }
                    // ponytail: private disk — these are ID docs, never web-servable
                    $validated[$field] = $request->file($field)->store('applicants/' . $field, 'local');
                }
            }

            $applicant->update($validated);

            // Keep users table in sync: login + navbar read users.email/name.
            // Without this, editing email breaks login and name stays as the
            // registration placeholder (email prefix).
            $userSync = array_intersect_key($validated, ['email' => null, 'nama' => null]);
            if (isset($userSync['nama'])) {
                $userSync['name'] = $userSync['nama'];
                unset($userSync['nama']);
            }
            if ($userSync) {
                $user->update($userSync);
            }

            DB::commit();

            return new ApplicantResource($applicant);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Applicant update failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Gagal menyimpan data. Silakan coba lagi.',
            ], 500);
        }
    }

    /**
     * View applicant file inline in browser (admin only).
     */
    public function viewFile(Applicant $applicant, string $field)
    {
        $this->ensureAdmin();
        $this->validateFileField($field, $applicant);

        $relativePath = $applicant->$field;
        Log::debug('viewFile', ['applicant_id' => $applicant->id, 'field' => $field, 'path' => $relativePath]);

        if (!Storage::disk('local')->exists($relativePath)) {
            abort(404);
        }

        return Storage::disk('local')->response($relativePath, null, self::NO_CACHE);
    }

    /**
     * Download applicant file (admin only).
     */
    public function downloadFile(Applicant $applicant, string $field)
    {
        $this->ensureAdmin();
        $this->validateFileField($field, $applicant);

        $relativePath = $applicant->$field;
        $ext = pathinfo($relativePath, PATHINFO_EXTENSION);
        $filename = $field . '_' . $applicant->nama . '.' . $ext;

        return Storage::disk('local')->download($relativePath, $filename, self::NO_CACHE);
    }

    /**
     * View own applicant file (user).
     */
    public function viewOwnFile(Request $request, string $field)
    {
        $applicant = $request->user()->applicant;
        abort_unless($applicant, 404);

        $this->validateFileField($field, $applicant);

        $relativePath = $applicant->$field;

        if (!Storage::disk('local')->exists($relativePath)) {
            abort(404);
        }

        return Storage::disk('local')->response($relativePath, null, self::NO_CACHE);
    }

    private function validateFileField(string $field, $applicant): void
    {
        $allowed = ['dokumen_ktp', 'dokumen_kk', 'dokumen_paspor', 'foto'];
        abort_unless(in_array($field, $allowed) && $applicant->$field, 404);
    }

    /**
     * Display the specified applicant.
     */
    public function show(Applicant $applicant)
    {
        $this->ensureAdmin();
        return new ApplicantResource($applicant->load(['payments', 'user']));
    }

    /**
     * Update applicant status (admin only).
     */
    public function updateStatus(Request $request, Applicant $applicant)
    {
        $this->ensureAdmin();
        $validated = $request->validate([
            'status' => 'required|in:pending,review,diterima,ditolak',
        ]);

        $applicant->update($validated);

        return new ApplicantResource($applicant);
    }

    /**
     * Check if applicant is allowed to submit payment (public).
     */
    public function checkPaymentStatus(Request $request)
    {
        $validated = $request->validate([
            'no_hp' => 'required|string|max:20',
        ]);

        $applicant = Applicant::where('no_hp', $validated['no_hp'])
            ->whereNotNull('payment_allowed_at')
            ->first();

        if (!$applicant) {
            return response()->json([
                'allowed' => false,
                'message' => 'Pembayaran belum diizinkan. Silakan hubungi admin via WhatsApp.',
            ]);
        }

        $hasPayment = $applicant->payments()->exists();

        // ponytail: no applicant_id here — it was an enumeration handle.
        // Residual oracle (does this approved number have a payment?) is
        // throttled and business-required for the legacy phone-check page.
        return response()->json([
            'allowed' => true,
            'has_payment' => $hasPayment,
            'message' => $hasPayment
                ? 'Bukti pembayaran sudah dikirim.'
                : 'Silakan upload bukti pembayaran.',
        ]);
    }

    /**
     * Allow applicant to submit payment (admin only).
     */
    public function allowPayment(Request $request, Applicant $applicant)
    {
        $this->ensureAdmin();
        $applicant->update([
            'payment_allowed_at' => now(),
            'status' => 'review',
        ]);

        return new ApplicantResource($applicant);
    }

    /**
     * Remove the specified applicant.
     */
    public function destroy(Applicant $applicant)
    {
        $this->ensureAdmin();

        // Delete associated files
        $fileFields = ['dokumen_ktp', 'dokumen_kk', 'dokumen_paspor', 'foto'];
        foreach ($fileFields as $field) {
            if ($applicant->$field) {
                Storage::disk('local')->delete($applicant->$field);
            }
        }

        // Also delete the user account so login credentials are revoked
        if ($applicant->user) {
            $applicant->user->tokens()->delete();
            $applicant->user->delete();
        }

        $applicant->delete();

        return response()->json(['message' => 'Pendaftar berhasil dihapus.']);
    }

    /**
     * User deletes their own registration + account.
     */
    public function destroyOwn(Request $request)
    {
        $user = $request->user();
        $applicant = $user->applicant;

        if (!$applicant) {
            return response()->json(['message' => 'Data pendaftar tidak ditemukan.'], 404);
        }

        // Delete associated files
        $fileFields = ['dokumen_ktp', 'dokumen_kk', 'dokumen_paspor', 'foto'];
        foreach ($fileFields as $field) {
            if ($applicant->$field) {
                Storage::disk('local')->delete($applicant->$field);
            }
        }

        // Delete payment proofs
        foreach ($applicant->payments as $payment) {
            if ($payment->bukti) {
                Storage::disk('local')->delete($payment->bukti);
            }
        }

        $user->tokens()->delete();
        $applicant->delete();
        $user->delete();

        return response()->json(['message' => 'Pendaftaran berhasil dihapus.']);
    }
}
