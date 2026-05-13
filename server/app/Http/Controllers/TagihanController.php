<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use App\Models\Tagihan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TagihanController extends Controller
{
    /**
     * [ADMIN] Ambil semua tagihan dengan join ke user & kamar
     */
    public function index(): JsonResponse
    {
        $tagihans = DB::table('tagihan')
            ->join('riwayat_sewa', 'tagihan.id_sewa', '=', 'riwayat_sewa.id_sewa')
            ->join('users', 'riwayat_sewa.id_user', '=', 'users.id')
            ->join('kamar', 'riwayat_sewa.id_kamar', '=', 'kamar.id_kamar')
            ->select(
                'tagihan.id_tagihan',
                'tagihan.kode_invoice',
                'tagihan.tanggal_tagihan',
                'tagihan.tanggal_jatuh_tempo',
                'tagihan.total_tagihan',
                'tagihan.status_tagihan',
                'users.nama_lengkap',
                'users.no_hp',
                'kamar.nomor_kamar'
            )
            ->orderBy('tagihan.tanggal_jatuh_tempo', 'asc')
            ->get()
            ->map(function ($t) {
                // Hitung hari tersisa
                $jatuhTempo = \Carbon\Carbon::parse($t->tanggal_jatuh_tempo);
                $t->hari_tersisa = now()->diffInDays($jatuhTempo, false);
                return $t;
            });

        return response()->json(['tagihans' => $tagihans]);
    }

    /**
     * [PENYEWA] Ambil tagihan milik penyewa yang sedang login
     */
    public function tagihanPenyewa(Request $request): JsonResponse
    {
        $user = $request->user();

        $tagihans = DB::table('tagihan')
            ->join('riwayat_sewa', 'tagihan.id_sewa', '=', 'riwayat_sewa.id_sewa')
            ->join('kamar', 'riwayat_sewa.id_kamar', '=', 'kamar.id_kamar')
            ->leftJoin('pembayaran', 'pembayaran.id_tagihan', '=', 'tagihan.id_tagihan')
            ->where('riwayat_sewa.id_user', $user->id)
            ->select(
                'tagihan.id_tagihan',
                'tagihan.kode_invoice',
                'tagihan.tanggal_tagihan',
                'tagihan.tanggal_jatuh_tempo',
                'tagihan.total_tagihan',
                'tagihan.status_tagihan',
                'kamar.nomor_kamar',
                'kamar.harga_bulanan',
                'pembayaran.id_pembayaran',
                'pembayaran.tanggal_bayar',
                'pembayaran.jumlah_bayar',
                'pembayaran.metode_pembayaran',
                'pembayaran.bukti_bayar',
                'pembayaran.status_verifikasi',
                'pembayaran.catatan_admin'
            )
            ->orderBy('tagihan.tanggal_jatuh_tempo', 'desc')
            ->get()
            ->map(function ($t) {
                $jatuhTempo = \Carbon\Carbon::parse($t->tanggal_jatuh_tempo);
                $t->hari_tersisa = now()->diffInDays($jatuhTempo, false);
                return $t;
            });

        return response()->json(['tagihans' => $tagihans]);
    }

    /**
     * [PENYEWA] Upload bukti pembayaran
     */
    public function bayar(Request $request, $id_tagihan): JsonResponse
    {
        $request->validate([
            'metode_pembayaran' => 'required|string',
            'bukti_bayar'       => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $tagihan = Tagihan::findOrFail($id_tagihan);

        // Pastikan tagihan belum lunas
        if ($tagihan->status_tagihan === 'lunas') {
            return response()->json(['message' => 'Tagihan sudah lunas'], 422);
        }

        // Simpan file
        $path = $request->file('bukti_bayar')->store('bukti_pembayaran', 'public');

        // Hapus pembayaran pending sebelumnya jika ada
        Pembayaran::where('id_tagihan', $id_tagihan)
            ->where('status_verifikasi', 'pending')
            ->delete();

        // Buat record pembayaran baru
        $pembayaran = Pembayaran::create([
            'id_tagihan'        => $id_tagihan,
            'tanggal_bayar'     => now()->toDateString(),
            'jumlah_bayar'      => $tagihan->total_tagihan,
            'metode_pembayaran' => $request->metode_pembayaran,
            'bukti_bayar'       => $path,
            'status_verifikasi' => 'pending',
        ]);

        // Update status tagihan menjadi pending (menunggu validasi)
        $tagihan->update(['status_tagihan' => 'pending']);

        return response()->json([
            'message'    => 'Bukti pembayaran berhasil dikirim, menunggu verifikasi admin.',
            'pembayaran' => $pembayaran,
        ]);
    }

    /**
     * [ADMIN] Lihat semua pembayaran yang pending untuk divalidasi
     */
    public function listPembayaranPending(): JsonResponse
    {
        $pembayarans = DB::table('pembayaran')
            ->join('tagihan', 'pembayaran.id_tagihan', '=', 'tagihan.id_tagihan')
            ->join('riwayat_sewa', 'tagihan.id_sewa', '=', 'riwayat_sewa.id_sewa')
            ->join('users', 'riwayat_sewa.id_user', '=', 'users.id')
            ->join('kamar', 'riwayat_sewa.id_kamar', '=', 'kamar.id_kamar')
            ->where('pembayaran.status_verifikasi', 'pending')
            ->select(
                'pembayaran.*',
                'tagihan.kode_invoice',
                'tagihan.total_tagihan',
                'users.nama_lengkap',
                'kamar.nomor_kamar'
            )
            ->orderBy('pembayaran.created_at', 'desc')
            ->get();

        return response()->json(['pembayarans' => $pembayarans]);
    }

    /**
     * [ADMIN] Verifikasi / tolak pembayaran
     */
    public function verifikasi(Request $request, $id_pembayaran): JsonResponse
    {
        $request->validate([
            'status_verifikasi' => 'required|in:diterima,ditolak',
            'catatan_admin'     => 'nullable|string',
        ]);

        $pembayaran = Pembayaran::with('tagihan')->findOrFail($id_pembayaran);

        $pembayaran->update([
            'status_verifikasi' => $request->status_verifikasi,
            'catatan_admin'     => $request->catatan_admin,
        ]);

        // Jika diterima, ubah status tagihan menjadi lunas
        if ($request->status_verifikasi === 'diterima') {
            $pembayaran->tagihan->update(['status_tagihan' => 'lunas']);
        } else {
            // Jika ditolak, kembalikan ke belum_bayar
            $pembayaran->tagihan->update(['status_tagihan' => 'belum_bayar']);
        }

        return response()->json([
            'message' => $request->status_verifikasi === 'diterima'
                ? 'Pembayaran berhasil diverifikasi, tagihan ditandai LUNAS.'
                : 'Pembayaran ditolak, penyewa perlu upload ulang.',
        ]);
    }
}
