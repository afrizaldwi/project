<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\KamarController;
use App\Http\Controllers\PenghuniController;
use App\Http\Controllers\VisitorController;
use Illuminate\Support\Facades\Route;

Route::get('/csrf-token', function () {
    return response()->json(['token' => csrf_token()]);
});

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // Kamar routes
    Route::get('/kamar', [KamarController::class, 'index']);
    Route::get('/kamar/{id}', [KamarController::class, 'show']);
    Route::post('/kamar', [KamarController::class, 'store']);
    Route::post('/kamar/{id}', [KamarController::class, 'update']);
    Route::delete('/kamar/{id}', [KamarController::class, 'destroy']);

    // Penghuni routes
    Route::get('/penghuni', [PenghuniController::class, 'index']);
    Route::get('/penghuni/{id}', [PenghuniController::class, 'show']);
    Route::post('/penghuni', [PenghuniController::class, 'store']);
    Route::post('/penghuni/{id}/perpanjang', [PenghuniController::class, 'perpanjang']);
    Route::patch('/penghuni/{id}/status', [PenghuniController::class, 'updateStatus']);
});

Route::post('/track-visitor', [VisitorController::class, 'track']);