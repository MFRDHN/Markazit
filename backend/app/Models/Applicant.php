<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Applicant extends Model
{
    protected $fillable = [
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
    ];

    protected $casts = [
        'usia' => 'integer',
    ];

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
