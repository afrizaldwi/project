<?php

use App\Http\Controllers\Admin\AdminPenghuniController;
use App\Http\Controllers\Admin\LaporanKeuanganController;
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

    Route::prefix('admin')->group(function () {
        Route::get('/penghuni', [AdminPenghuniController::class, 'index']);
        Route::post('/penghuni', [AdminPenghuniController::class, 'store']);
        Route::get('/kamar/tersedia', [AdminPenghuniController::class, 'availableRooms']);
        Route::patch('/penghuni/{idSewa}/selesaikan', [AdminPenghuniController::class, 'finishSewa']);

        Route::get('/laporan-keuangan', [LaporanKeuanganController::class, 'summary']);
        Route::get('/pengeluaran', [LaporanKeuanganController::class, 'pengeluaran']);
        Route::post('/pengeluaran', [LaporanKeuanganController::class, 'storePengeluaran']);
        Route::delete('/pengeluaran/{idPengeluaran}', [LaporanKeuanganController::class, 'destroyPengeluaran']);
    });
});

Route::post('/track-visitor', [VisitorController::class, 'track']);
