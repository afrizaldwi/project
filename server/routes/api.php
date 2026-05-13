<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\TagihanController;
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

    // ===== TAGIHAN ROUTES =====
    // Admin: lihat semua tagihan
    Route::get('/tagihan', [TagihanController::class, 'index']);
    // Penyewa: lihat tagihan miliknya
    Route::get('/tagihan/saya', [TagihanController::class, 'tagihanPenyewa']);
    // Penyewa: upload bukti pembayaran
    Route::post('/tagihan/{id_tagihan}/bayar', [TagihanController::class, 'bayar']);

    // ===== PEMBAYARAN ROUTES =====
    // Admin: lihat semua pembayaran pending
    Route::get('/pembayaran/pending', [TagihanController::class, 'listPembayaranPending']);
    // Admin: verifikasi/tolak pembayaran
    Route::post('/pembayaran/{id_pembayaran}/verifikasi', [TagihanController::class, 'verifikasi']);

    // ===== NOTIFIKASI WA =====
    Route::post('/notifikasi/kirim-wa/{id}', [NotifikasiController::class, 'kirimWa']);
});

Route::post('/track-visitor', [VisitorController::class, 'track']);
