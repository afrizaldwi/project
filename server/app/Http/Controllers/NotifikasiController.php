<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\NotifikasiPopup;
use App\Services\NotifikasiService;
use App\Services\WhatsAppService;
use App\Services\PopupService;

class NotifikasiController extends Controller
{
    private function buatNotifikasiService(): NotifikasiService
    {
        $service = new NotifikasiService();

        // Observer pattern-nya ada di sini — tinggal tambah handler kalau mau channel baru
        $wa    = new WhatsAppService();
        $popup = new PopupService();

        $service->addHandler(fn($payload) => $wa->kirimTagihan($payload));
        $service->addHandler(fn($payload) => $popup->simpan($payload));

        return $service;
    }

    public function getPopup()
    {
        $notifikasi = NotifikasiPopup::where('dibaca', false)
            ->orderByDesc('created_at')
            ->get(['id', 'pesan', 'created_at', 'id_tagihan']);

        return response()->json(['notifikasi' => $notifikasi]);
    }

    public function tandaiBaca($id)
    {
        NotifikasiPopup::where('id', $id)->update(['dibaca' => true]);
        return response()->json(['success' => true]);
    }

    public function kirimWA($id_tagihan)
    {
        $tagihan = DB::selectOne("
            SELECT t.*, p.nama_lengkap, p.no_whatsapp, k.nomor_kamar,
                   DATEDIFF(t.tanggal_jatuh_tempo, CURDATE()) AS hari_tersisa
            FROM tagihan t
            JOIN penyewa p ON t.id_penyewa = p.id_penyewa
            JOIN kamar k   ON t.id_kamar   = k.id_kamar
            WHERE t.id_tagihan = ?
        ", [$id_tagihan]);

        if (!$tagihan) {
            return response()->json(['error' => 'Tagihan tidak ditemukan'], 404);
        }

        $this->buatNotifikasiService()->kirim((array) $tagihan);

        return response()->json([
            'success' => true,
            'pesan'   => "WA terkirim ke {$tagihan->no_whatsapp}"
        ]);
    }
}