<?php
namespace App\Services;

use Illuminate\Support\Facades\DB;

class PopupService
{
    public function simpan(array $payload): void
    {
        DB::table('notifikasi_popup')->updateOrInsert(
            ['id_tagihan' => $payload['id_tagihan']],
            [
                'pesan'      => "Tagihan {$payload['nama_lengkap']} (Kmr {$payload['nomor_kamar']}) jatuh tempo {$payload['hari_tersisa']} hari lagi",
                'dibaca'     => false,
                'created_at' => now(),
            ]
        );
    }
}