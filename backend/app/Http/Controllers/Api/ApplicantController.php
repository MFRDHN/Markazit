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
        $query = Applicant::with('payments')->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
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
            'password' => 'required|string|min:6|confirmed',
        ]);

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => explode('@', $validated['email'])[0],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'applicant',
            ]);

            // ponytail: minimal applicant stub; user fills rest in dashboard
            $applicant = Applicant::create([
                'user_id' => $user->id,
                'nama' => explode('@', $validated['email'])[0],
                'usia' => 18,
                'no_hp' => '-',
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
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
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
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('applicants', 'email')->ignore($applicant->id)],
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
                        Storage::disk('public')->delete($applicant->$field);
                    }
                    $validated[$field] = $request->file($field)->store('applicants/' . $field, 'public');
                }
            }

            $applicant->update($validated);

            DB::commit();

            return new ApplicantResource($applicant);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Applicant update failed: ' . $e->getMessage());
            return response()->json(['message' => 'Gagal mengupdate data.'], 500);
        }
    }

    /**
     * View applicant file inline in browser (admin only).
     */
    public function viewFile(Applicant $applicant, string $field)
    {
        $this->ensureAdmin();
        $this->validateFileField($field, $applicant);
        $path = $this->resolveFilePath($field, $applicant);

        return response()->file($path, self::NO_CACHE);
    }

    /**
     * Download applicant file (admin only).
     */
    public function downloadFile(Applicant $applicant, string $field)
    {
        $this->ensureAdmin();
        $this->validateFileField($field, $applicant);
        $path = $this->resolveFilePath($field, $applicant);

        return response()->download($path, $field . '_' . $applicant->nama . '.' . pathinfo($path, PATHINFO_EXTENSION));
    }

    /**
     * View own applicant file (user).
     */
    public function viewOwnFile(Request $request, string $field)
    {
        $applicant = $request->user()->applicant;
        abort_unless($applicant, 404);

        $this->validateFileField($field, $applicant);
        $path = $this->resolveFilePath($field, $applicant);

        return response()->file($path, self::NO_CACHE);
    }

    private function validateFileField(string $field, $applicant): void
    {
        $allowed = ['dokumen_ktp', 'dokumen_kk', 'dokumen_paspor', 'foto'];
        abort_unless(in_array($field, $allowed) && $applicant->$field, 404);
    }

    private function resolveFilePath(string $field, $applicant): string
    {
        $path = storage_path('app/public/' . $applicant->$field);
        abort_unless(file_exists($path), 404);
        return $path;
    }

    /**
     * Display the specified applicant.
     */
    public function show(Applicant $applicant)
    {
        $this->ensureAdmin();
        return new ApplicantResource($applicant->load('payments'));
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

        return response()->json([
            'allowed' => true,
            'applicant_id' => $applicant->id,
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
                Storage::disk('public')->delete($applicant->$field);
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
}
