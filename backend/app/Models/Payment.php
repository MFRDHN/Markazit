<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'applicant_id',
        'jumlah',
        'norek_pengirim',
        'bank_pengirim',
        'keterangan',
        'status',
        'bukti',
    ];

    protected $casts = [
        'jumlah' => 'decimal:2',
    ];

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(Applicant::class);
    }
}
