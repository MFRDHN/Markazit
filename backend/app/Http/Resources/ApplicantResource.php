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
            'dokumen_ktp' => $this->dokumen_ktp ? asset('storage/' . $this->dokumen_ktp) : null,
            'dokumen_kk' => $this->dokumen_kk ? asset('storage/' . $this->dokumen_kk) : null,
            'dokumen_paspor' => $this->dokumen_paspor ? asset('storage/' . $this->dokumen_paspor) : null,
            'foto' => $this->foto ? asset('storage/' . $this->foto) : null,
            'motivasi' => $this->motivasi,
            'status' => $this->status,
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
