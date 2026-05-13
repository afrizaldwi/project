<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class WhatsAppService
{
    public function kirimTagihan(array $payload): void
    {
        $pesan = "Halo {$payload['nama_lengkap']}, tagihan kamar {$payload['nomor_kamar']} "
               . "sebesar Rp " . number_format($payload['total_tagihan'], 0, ',', '.')
               . " jatuh tempo dalam {$payload['hari_tersisa']} hari. Segera lakukan pembayaran.";

        Http::withHeaders([
            'Authorization' => env('FONNTE_TOKEN')
        ])->post('https://api.fonnte.com/send', [
            'target'  => $payload['no_whatsapp'],
            'message' => $pesan,
        ]);
    }
}