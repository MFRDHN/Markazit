<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'usia' => $this->usia,
            'no_hp' => $this->no_hp,
            'email' => $this->email,
            // ponytail: raw path only; frontend uses API routes with auth header
            'dokumen_ktp' => $this->dokumen_ktp,
            'dokumen_kk' => $this->dokumen_kk,
            'dokumen_paspor' => $this->dokumen_paspor,
            'foto' => $this->foto,
            'motivasi' => $this->motivasi,
            'status' => $this->status,
            'payment_allowed_at' => $this->payment_allowed_at,
            // Device/IP trace for admin (spam investigation)
            'registrasi_ip' => $this->when(
                $this->relationLoaded('user') && auth()->user()?->role === 'admin',
                fn () => $this->user?->registrasi_ip
            ),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
