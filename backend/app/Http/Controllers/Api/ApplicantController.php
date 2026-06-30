<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicantResource;
use App\Mail\ApplicantConfirmation;
use App\Models\Applicant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class ApplicantController extends Controller
{
    /**
     * Display a listing of applicants (admin only).
     */
    public function index(Request $request)
    {
        $query = Applicant::with('payments')->latest();

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search by name or email
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
     * Store a newly created applicant (public).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'usia' => 'required|integer|min:15|max:45',
            'no_hp' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'dokumen_ktp' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'dokumen_kk' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'dokumen_paspor' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'foto' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'motivasi' => 'nullable|string',
        ]);

        // Handle file uploads
        $fileFields = ['dokumen_ktp', 'dokumen_kk', 'dokumen_paspor', 'foto'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $validated[$field] = $request->file($field)->store('applicants/' . $field, 'public');
            }
        }

        $applicant = Applicant::create($validated);

        // Send confirmation email
        try {
            Mail::to($applicant->email)->queue(new ApplicantConfirmation($applicant));
        } catch (\Exception $e) {
            // Log error but don't fail the registration
            \Log::error('Failed to send confirmation email: ' . $e->getMessage());
        }

        return new ApplicantResource($applicant);
    }

    /**
     * Display the specified applicant.
     */
    public function show(Applicant $applicant)
    {
        return new ApplicantResource($applicant->load('payments'));
    }

    /**
     * Update applicant status (admin only).
     */
    public function updateStatus(Request $request, Applicant $applicant)
    {
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
        // Delete associated files
        $fileFields = ['dokumen_ktp', 'dokumen_kk', 'dokumen_paspor', 'foto'];
        foreach ($fileFields as $field) {
            if ($applicant->$field) {
                Storage::disk('public')->delete($applicant->$field);
            }
        }

        $applicant->delete();

        return response()->json(['message' => 'Pendaftar berhasil dihapus.']);
    }
}
