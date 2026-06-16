<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return [
        'app' => 'Markaz IT Madinah API',
        'status' => 'Active',
        'message' => 'Silakan akses tampilan website (frontend) di http://localhost:5173'
    ];
});
