<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApplicantController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==========================================
// PUBLIC ROUTES (no auth required)
// ==========================================

// Programs
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/programs/{program}', [ProgramController::class, 'show']);

// Gallery
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/gallery/categories', [GalleryController::class, 'categories']);
Route::get('/gallery/{gallery}', [GalleryController::class, 'show']);

// Testimonials
Route::get('/testimonials', [TestimonialController::class, 'index']);

// Blog
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/categories', [BlogController::class, 'categories']);
Route::get('/blogs/{blog:id}', [BlogController::class, 'show']);

// Applicant registration (public)
Route::post('/applicants', [ApplicantController::class, 'store']);

// Payment submission (public)
Route::post('/payments', [PaymentController::class, 'store']);

// Check payment status by phone number (public)
Route::post('/applicants/check-payment', [ApplicantController::class, 'checkPaymentStatus']);

// Admin login
Route::post('/admin/login', [AuthController::class, 'login']);

// ==========================================
// PROTECTED ROUTES (auth:sanctum required)
// ==========================================

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/admin/logout', [AuthController::class, 'logout']);
    Route::get('/admin/me', [AuthController::class, 'me']);
    Route::get('/admin/dashboard', [AuthController::class, 'dashboard']);

    // Applicants management
    Route::get('/applicants', [ApplicantController::class, 'index']);
    Route::get('/applicants/{applicant}', [ApplicantController::class, 'show']);
    Route::put('/applicants/{applicant}/status', [ApplicantController::class, 'updateStatus']);
    Route::put('/applicants/{applicant}/allow-payment', [ApplicantController::class, 'allowPayment']);
    Route::delete('/applicants/{applicant}', [ApplicantController::class, 'destroy']);

    // Programs CRUD (admin)
    Route::post('/programs', [ProgramController::class, 'store']);
    Route::put('/programs/{program}', [ProgramController::class, 'update']);
    Route::delete('/programs/{program}', [ProgramController::class, 'destroy']);

    // Gallery CRUD (admin)
    Route::post('/gallery', [GalleryController::class, 'store']);
    Route::put('/gallery/{gallery}', [GalleryController::class, 'update']);
    Route::delete('/gallery/{gallery}', [GalleryController::class, 'destroy']);

    // Testimonials CRUD (admin)
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);

    // Blog CRUD (admin)
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::put('/blogs/{blog:id}', [BlogController::class, 'update']);
    Route::delete('/blogs/{blog:id}', [BlogController::class, 'destroy']);

    // Payments management (admin)
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/payments/{payment}', [PaymentController::class, 'show']);
    Route::put('/payments/{payment}/status', [PaymentController::class, 'updateStatus']);
});
