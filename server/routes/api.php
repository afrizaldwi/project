<?php

use App\Http\Controllers\Admin\AdminPenghuniController;
use App\Http\Controllers\Admin\LaporanKeuanganController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\KamarController;
use App\Http\Controllers\VisitorController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\Penyewa\DashboardController as PenyewaDashboardController;
use App\Http\Controllers\TagihanReminderController;
use App\Http\Controllers\SewaExtensionController;

Route::get('/csrf-token', function () {
    return response()->json([
        'token' => csrf_token()
    ]);
});

Route::post('/track-visitor', [VisitorController::class, 'track']);

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    Route::get('/notifikasi', [TagihanReminderController::class, 'notifications']);
    Route::patch('/notifikasi/{idNotifikasi}/read', [TagihanReminderController::class, 'markNotificationAsRead']);
    Route::post('/mobile/device-token', [TagihanReminderController::class, 'registerDeviceToken']);
    Route::get('/tagihan/{idTagihan}/whatsapp-message', [TagihanReminderController::class, 'whatsappMessage']);

    Route::prefix('admin')->group(function () {
        Route::get('/dashboard-summary', [DashboardController::class, 'summary']);

        Route::apiResource('kamar', KamarController::class);

        Route::get('/sewa', [SewaExtensionController::class, 'index']);
        Route::get('/sewa/{id}', [SewaExtensionController::class, 'show']);
        Route::patch('/sewa/{id}/perpanjang', [SewaExtensionController::class, 'perpanjang']);

        Route::get('/penghuni', [AdminPenghuniController::class, 'index']);
        Route::post('/penghuni', [AdminPenghuniController::class, 'store']);
        Route::get('/kamar/tersedia', [AdminPenghuniController::class, 'availableRooms']);
        Route::patch('/penghuni/{idSewa}/selesaikan', [AdminPenghuniController::class, 'finishSewa']);

        Route::get('/laporan-keuangan', [LaporanKeuanganController::class, 'summary']);
        Route::get('/pengeluaran', [LaporanKeuanganController::class, 'pengeluaran']);
        Route::post('/pengeluaran', [LaporanKeuanganController::class, 'storePengeluaran']);
        Route::delete('/pengeluaran/{idPengeluaran}', [LaporanKeuanganController::class, 'destroyPengeluaran']);

        Route::get('/tagihan', [TagihanReminderController::class, 'adminTagihan']);
        Route::post('/tagihan/check-jatuh-tempo', [TagihanReminderController::class, 'checkDueDate']);
        Route::get('/pembayaran/pending', [TagihanReminderController::class, 'pendingPayments']);
        Route::patch('/pembayaran/{idPembayaran}/verify', [TagihanReminderController::class, 'verifyPayment']);
        Route::patch('/pembayaran/{idPembayaran}/reject', [TagihanReminderController::class, 'rejectPayment']);

        Route::get('/invoices', [InvoiceController::class, 'adminIndex']);
        Route::get('/invoices/{idPembayaran}/pdf', [InvoiceController::class, 'adminPdf']);
    });

    Route::prefix('penyewa')->group(function () {
        Route::get('/dashboard-summary', [PenyewaDashboardController::class, 'summary']);

        Route::get('/tagihan', [TagihanReminderController::class, 'penyewaTagihan']);
        Route::post('/tagihan/{idTagihan}/bayar', [TagihanReminderController::class, 'uploadPaymentProof']);

        Route::get('/invoices', [InvoiceController::class, 'penyewaIndex']);
        Route::get('/invoices/{idPembayaran}/pdf', [InvoiceController::class, 'penyewaPdf']);
    });
});
