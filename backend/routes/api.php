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

// Applicant registration (public) — throttled: 5 per IP per minute
Route::post('/applicants', [ApplicantController::class, 'store'])->middleware('throttle:forms');

// Check payment status by phone number (public)
Route::post('/applicants/check-payment', [ApplicantController::class, 'checkPaymentStatus'])->middleware('throttle:forms');

// User login (public)
Route::post('/login', [AuthController::class, 'userLogin'])->middleware('throttle:forms');

// Admin login
Route::post('/admin/login', [AuthController::class, 'login'])->middleware('throttle:forms');

// ==========================================
// USER ROUTES (auth:sanctum) — applicant dashboard
// ==========================================

Route::middleware('auth:sanctum')->group(function () {

    // User auth
    Route::post('/logout', [AuthController::class, 'userLogout']);
    Route::get('/me', [AuthController::class, 'me']);

    // User own data
    Route::get('/applicants/me', [ApplicantController::class, 'showOwn']);
    Route::put('/applicants/me', [ApplicantController::class, 'updateOwn']);

    // User own payments
    Route::get('/payments/mine', [PaymentController::class, 'myPayments']);
    Route::post('/payments', [PaymentController::class, 'store'])->middleware('throttle:forms');

    // User view own file
    Route::get('/applicants/me/file/{field}', [ApplicantController::class, 'viewOwnFile']);
    Route::get('/payments/mine/{payment}/file', [PaymentController::class, 'viewOwnFile']);
});

// ==========================================
// ADMIN ROUTES (auth:sanctum)
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
    Route::get('/applicants/{applicant}/download/{field}', [ApplicantController::class, 'downloadFile']);
    Route::get('/applicants/{applicant}/file/{field}', [ApplicantController::class, 'viewFile']);

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
