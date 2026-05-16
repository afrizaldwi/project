<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VisitorController;
use App\Http\Controllers\Api\BukuTamuController;
use App\Http\Controllers\Api\KeluhanController;
use App\Http\Controllers\Api\KamarController;
use Illuminate\Support\Facades\Route;

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

// Data Tamu
Route::get('/tamu', [BukuTamuController::class, 'index']);
Route::post('/tamu', [BukuTamuController::class, 'store']);
Route::delete('/tamu/{id}', [BukuTamuController::class, 'destroy']);

// Keluhan / Laporan Kerusakan
Route::get('/keluhan', [KeluhanController::class, 'index']);
Route::post('/keluhan', [KeluhanController::class, 'store']);
Route::put('/keluhan/{id}', [KeluhanController::class, 'updateStatus']);
Route::delete('/keluhan/{id}', [KeluhanController::class, 'destroy']);

// Kamar
Route::get('/kamar/terisi', [KamarController::class, 'getTerisi']);

Route::post('/track-visitor', [VisitorController::class, 'track']);
