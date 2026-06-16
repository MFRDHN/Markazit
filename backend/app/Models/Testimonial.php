<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'nama',
        'asal',
        'foto',
        'isi',
        'rating',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];
}
