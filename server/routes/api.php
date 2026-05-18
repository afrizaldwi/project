<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\KamarController;
use App\Http\Controllers\VisitorController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Penyewa\DashboardController as PenyewaDashboardController;
use App\Http\Controllers\SewaExtensionController;

Route::get('/csrf-token', function () {
    return response()->json([
        'token' => csrf_token()
    ]);
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
});

Route::post('/track-visitor', [VisitorController::class, 'track']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/dashboard-summary', [DashboardController::class, 'summary']);

    Route::apiResource('kamar', KamarController::class);

    Route::get('/sewa', [SewaExtensionController::class, 'index']);
    Route::get('/sewa/{id}', [SewaExtensionController::class, 'show']);
    Route::patch('/sewa/{id}/perpanjang', [SewaExtensionController::class, 'perpanjang']);
});

Route::middleware('auth:sanctum')->prefix('penyewa')->group(function () {
    Route::get('/dashboard-summary', [PenyewaDashboardController::class, 'summary']);
});
