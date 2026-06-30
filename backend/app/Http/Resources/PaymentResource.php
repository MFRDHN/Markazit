<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'applicant_id' => $this->applicant_id,
            'jumlah' => $this->jumlah,
            'norek_pengirim' => $this->norek_pengirim,
            'bank_pengirim' => $this->bank_pengirim,
            'status' => $this->status,
            'bukti' => $this->bukti ? url('/s.php?f=' . $this->bukti) : null,
            'applicant' => new ApplicantResource($this->whenLoaded('applicant')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
