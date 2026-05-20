<?php

namespace App\Patterns\State;

use App\Models\Pembayaran;
use Carbon\Carbon;

class PendingPaymentState implements PaymentStateInterface
{
    public function verify(Pembayaran $pembayaran, ?string $catatanAdmin): array
    {
        $pembayaran->update([
            'status_verifikasi' => 'diterima',
            'catatan_admin' => $catatanAdmin,
        ]);

        $pembayaran->tagihan->update([
            'status_tagihan' => 'lunas',
        ]);

        return [
            'success' => true,
            'message' => 'Pembayaran berhasil diverifikasi.'
        ];
    }

    public function reject(Pembayaran $pembayaran, ?string $catatanAdmin): array
    {
        $tagihan = $pembayaran->tagihan;

        $nextTagihanStatus = Carbon::parse($tagihan->tanggal_jatuh_tempo)->isPast()
            ? 'telat'
            : 'belum_bayar';

        $pembayaran->update([
            'status_verifikasi' => 'ditolak',
            'catatan_admin' => $catatanAdmin,
        ]);

        $tagihan->update([
            'status_tagihan' => $nextTagihanStatus,
        ]);

        return [
            'success' => true,
            'message' => 'Pembayaran berhasil ditolak.'
        ];
    }
}
