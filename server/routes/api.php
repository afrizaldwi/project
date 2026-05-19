<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VisitorController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\InvoiceController;
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

    Route::prefix('admin')->group(function () {
        Route::get('/invoices', [InvoiceController::class, 'adminIndex']);
        Route::get('/invoices/{idPembayaran}/pdf', [InvoiceController::class, 'adminPdf']);
    });

    Route::prefix('penyewa')->group(function () {
        Route::get('/invoices', [InvoiceController::class, 'penyewaIndex']);
        Route::get('/invoices/{idPembayaran}/pdf', [InvoiceController::class, 'penyewaPdf']);
    });
});

Route::post('/track-visitor', [VisitorController::class, 'track']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/dashboard-summary', [DashboardController::class, 'summary']);
});

Route::middleware('auth:sanctum')->prefix('penyewa')->group(function () {
    Route::get('/dashboard-summary', [PenyewaDashboardController::class, 'summary']);
});
