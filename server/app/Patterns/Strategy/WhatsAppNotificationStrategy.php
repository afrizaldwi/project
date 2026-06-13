<?php

namespace App\Patterns\Strategy;

use App\Models\Tagihan;

class WhatsAppNotificationStrategy implements NotificationStrategyInterface
{
    public function generate(Tagihan $tagihan): array
    {
        $tagihan->loadMissing(['riwayatSewa.user', 'riwayatSewa.kamar']);

        $user = $tagihan->riwayatSewa?->user;
        $kamar = $tagihan->riwayatSewa?->kamar;

        $phone = $this->normalizePhone($user?->no_hp ?? '');

        $message = sprintf(
            "Halo %s, kami mengingatkan bahwa tagihan kost Anda dengan invoice %s untuk kamar %s sebesar Rp %s akan jatuh tempo pada %s. Mohon segera melakukan pembayaran. Terima kasih.",
            $user?->nama_lengkap ?? 'Penyewa',
            $tagihan->kode_invoice,
            $kamar?->nomor_kamar ?? '-',
            number_format((float) $tagihan->total_tagihan, 0, ',', '.'),
            $tagihan->tanggal_jatuh_tempo
        );

        return [
            'enabled' => $phone !== '',
            'phone' => $phone,
            'message' => $message,
            'url' => $phone !== ''
                ? 'https://wa.me/' . $phone . '?text=' . urlencode($message)
                : null,
        ];
    }

    private function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if ($phone === '') {
            return '';
        }

        if (str_starts_with($phone, '0')) {
            return '62' . substr($phone, 1);
        }

        if (str_starts_with($phone, '62')) {
            return $phone;
        }

        return $phone;
    }
}
