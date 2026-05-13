// app/Console/Commands/CheckJatuhTempo.php
<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Services\NotifikasiService;
use App\Services\WhatsAppService;
use App\Services\PopupService;

class CheckJatuhTempo extends Command
{
    protected $signature   = 'tagihan:cek-jatuh-tempo';
    protected $description = 'Cek tagihan H-7 dan kirim notifikasi';

    public function handle(): void
    {
        $tagihans = DB::select("
            SELECT 
                t.id_tagihan, p.nama_lengkap, k.nomor_kamar,
                p.no_whatsapp, t.total_tagihan, t.tanggal_jatuh_tempo,
                DATEDIFF(t.tanggal_jatuh_tempo, CURDATE()) AS hari_tersisa
            FROM tagihan t
            JOIN penyewa p ON t.id_penyewa = p.id_penyewa
            JOIN kamar k   ON t.id_kamar   = k.id_kamar
            WHERE t.status_pembayaran = 'belum_bayar'
              AND DATEDIFF(t.tanggal_jatuh_tempo, CURDATE()) = 7
        ");

        $service = new NotifikasiService();
        $wa      = new WhatsAppService();
        $popup   = new PopupService();

        $service->addHandler(fn($payload) => $wa->kirimTagihan($payload));
        $service->addHandler(fn($payload) => $popup->simpan($payload));

        foreach ($tagihans as $tagihan) {
            $service->kirim((array) $tagihan);
        }

        $this->info('Selesai: ' . count($tagihans) . ' tagihan diproses');
    }
}