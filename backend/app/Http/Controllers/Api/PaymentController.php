<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
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
     * Display a listing of payments (admin only).
     */
    public function index(Request $request)
    {
        $this->ensureAdmin();
        $query = Payment::with('applicant')->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $payments = $query->paginate($request->get('per_page', 15));

        return PaymentResource::collection($payments);
    }

    /**
     * Store a new payment for the logged-in user's own registration.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'jumlah' => 'required|numeric|min:1000|max:100000000',
            'norek_pengirim' => 'nullable|string|max:50',
            'bank_pengirim' => 'nullable|string|max:100',
            'keterangan' => 'nullable|string|max:255',
            'bukti' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        // ponytail: always attribute to the caller's own registration —
        // trusting applicant_id from the body let users pay on behalf of others.
        $applicant = $request->user()->applicant;
        if (!$applicant || !$applicant->payment_allowed_at) {
            return response()->json([
                'message' => 'Pembayaran belum diizinkan. Silakan hubungi admin.',
            ], 403);
        }

        $buktiPath = null;

        try {
            DB::beginTransaction();

            if ($request->hasFile('bukti')) {
                // ponytail: private disk — proof files must not be web-servable
                $buktiPath = $request->file('bukti')->store('payments', 'local');
            }

            $payment = Payment::create([
                ...$validated,
                'applicant_id' => $applicant->id,
                'bukti' => $buktiPath,
            ]);

            DB::commit();

            return new PaymentResource($payment);

        } catch (\Exception $e) {
            DB::rollBack();

            if ($buktiPath) {
                Storage::disk('local')->delete($buktiPath);
            }

            Log::error('Payment store failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Gagal menyimpan pembayaran. Silakan coba lagi.',
            ], 500);
        }
    }

    /**
     * Update payment status (admin only).
     */
    public function updateStatus(Request $request, Payment $payment)
    {
        $this->ensureAdmin();
        $validated = $request->validate([
            'status' => 'required|in:pending,verified,rejected',
        ]);

        $payment->update($validated);

        return new PaymentResource($payment);
    }

    /**
     * Display the specified payment.
     */
    public function show(Payment $payment)
    {
        $this->ensureAdmin();
        return new PaymentResource($payment->load('applicant'));
    }

    /**
     * Get own payments (authenticated user).
     */
    public function myPayments(Request $request)
    {
        $applicant = $request->user()->applicant;
        if (!$applicant) {
            return response()->json(['data' => []]);
        }

        $payments = Payment::where('applicant_id', $applicant->id)
            ->latest()
            ->paginate($request->get('per_page', 20));

        return PaymentResource::collection($payments);
    }

    /**
     * View own payment proof file.
     */
    public function viewOwnFile(Request $request, Payment $payment)
    {
        $applicant = $request->user()->applicant;
        abort_unless($applicant && $payment->applicant_id === $applicant->id, 403);
        abort_unless($payment->bukti && Storage::disk('local')->exists($payment->bukti), 404);

        return Storage::disk('local')->response($payment->bukti, null, self::NO_CACHE);
    }

    /**
     * User deletes own payment record + proof file.
     */
    public function destroyOwn(Request $request, Payment $payment)
    {
        $applicant = $request->user()->applicant;
        abort_unless($applicant && $payment->applicant_id === $applicant->id, 403);
        abort_if($payment->status === 'verified', 422, 'Pembayaran yang sudah diverifikasi tidak bisa dihapus. Hubungi admin.');

        if ($payment->bukti) {
            Storage::disk('local')->delete($payment->bukti);
        }
        $payment->delete();

        return response()->json(['message' => 'Pembayaran berhasil dihapus.']);
    }

    /**
     * Delete payment record + proof file (admin only).
     */
    public function destroy(Payment $payment)
    {
        $this->ensureAdmin();

        if ($payment->bukti) {
            Storage::disk('local')->delete($payment->bukti);
        }
        $payment->delete();

        return response()->json(['message' => 'Pembayaran berhasil dihapus.']);
    }

    /**
     * View payment proof file (admin only).
     */
    public function viewFile(Payment $payment)
    {
        $this->ensureAdmin();
        abort_unless($payment->bukti && Storage::disk('local')->exists($payment->bukti), 404);

        return Storage::disk('local')->response($payment->bukti, null, self::NO_CACHE);
    }
}
