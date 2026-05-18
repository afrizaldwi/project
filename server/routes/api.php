<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VisitorController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Api\BukuTamuController;
use App\Http\Controllers\Api\KeluhanController;
use App\Http\Controllers\Penyewa\DashboardController as PenyewaDashboardController;

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
    Route::get('/tamu', [BukuTamuController::class, 'index']);
    Route::post('/tamu', [BukuTamuController::class, 'store']);
    Route::get('/tamu/penghuni-aktif', [BukuTamuController::class, 'penghuniAktif']);
    Route::delete('/tamu/{id}', [BukuTamuController::class, 'destroy']);

    Route::get('/keluhan', [KeluhanController::class, 'index']);
    Route::patch('/keluhan/{id}/status', [KeluhanController::class, 'updateStatus']);
    Route::delete('/keluhan/{id}', [KeluhanController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->prefix('penyewa')->group(function () {
    Route::get('/dashboard-summary', [PenyewaDashboardController::class, 'summary']);
    Route::get('/tamu', [BukuTamuController::class, 'index']);
    Route::post('/tamu', [BukuTamuController::class, 'store']);

    Route::get('/keluhan', [KeluhanController::class, 'index']);
    Route::post('/keluhan', [KeluhanController::class, 'store']);
});
