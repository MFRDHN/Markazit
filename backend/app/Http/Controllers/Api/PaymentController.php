<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Applicant;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments (admin only).
     */
    public function index(Request $request)
    {
        $query = Payment::with('applicant')->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $payments = $query->paginate($request->get('per_page', 15));

        return PaymentResource::collection($payments);
    }

    /**
     * Store a new payment (public).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'applicant_id' => 'required|exists:applicants,id',
            'jumlah' => 'required|numeric|min:0',
            'norek_pengirim' => 'nullable|string|max:50',
            'bank_pengirim' => 'nullable|string|max:100',
            'bukti' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        // Verify applicant is allowed to pay
        $applicant = Applicant::where('id', $validated['applicant_id'])
            ->whereNotNull('payment_allowed_at')
            ->first();

        if (!$applicant) {
            return response()->json([
                'message' => 'Pembayaran belum diizinkan. Silakan hubungi admin.',
            ], 403);
        }

        $buktiPath = null;

        try {
            DB::beginTransaction();

            if ($request->hasFile('bukti')) {
                $buktiPath = $request->file('bukti')->store('payments', 'public');
                $validated['bukti'] = $buktiPath;
            }

            $payment = Payment::create($validated);

            DB::commit();

            return new PaymentResource($payment);

        } catch (\Exception $e) {
            DB::rollBack();

            if ($buktiPath) {
                Storage::disk('public')->delete($buktiPath);
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
}
