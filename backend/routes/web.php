<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return [
        'app' => 'Markaz IT Madinah API',
        'status' => 'Active',
        'message' => 'Silakan akses tampilan website (frontend) di https://markaz-it.web.id'
    ];
});

Route::get('/debug', function () {
    return [
        'storage_path' => storage_path(),
        'gallery_path' => storage_path('app/public/gallery'),
        'gallery_exists' => file_exists(storage_path('app/public/gallery')),
        'files' => file_exists(storage_path('app/public/gallery'))
            ? array_slice(scandir(storage_path('app/public/gallery')), 2)
            : [],
    ];
});

Route::any('/storage/{path}', function (string $path) {
    return response()->json([
        'message' => 'storage route hit',
        'path' => $path,
    ]);
})->where('path', '.*');

Route::fallback(function () {
    return response()->json([
        'message' => 'fallback hit',
        'uri' => request()->path(),
    ]);
});
