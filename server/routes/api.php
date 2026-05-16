<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VisitorController;
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

Route::post('/track-visitor', [VisitorController::class, 'track']);
