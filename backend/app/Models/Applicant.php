<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Applicant extends Model
{
    protected $fillable = [
        'user_id',
        'nama',
        'usia',
        'no_hp',
        'email',
        'dokumen_ktp',
        'dokumen_kk',
        'dokumen_paspor',
        'foto',
        'motivasi',
        'status',
        'payment_allowed_at',
    ];

    protected $casts = [
        'usia' => 'integer',
        'payment_allowed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
