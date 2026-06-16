<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;
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
     * Store a new payment (public - for DP submission).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'applicant_id' => 'required|exists:applicants,id',
            'jumlah' => 'required|numeric|min:0',
            'bukti' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        if ($request->hasFile('bukti')) {
            $validated['bukti'] = $request->file('bukti')->store('payments', 'public');
        }

        $payment = Payment::create($validated);

        return new PaymentResource($payment);
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
}
