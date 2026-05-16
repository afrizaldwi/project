<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RiwayatSewa;
use Illuminate\Http\Request;

class KamarController extends Controller
{
    public function getTerisi()
    {
        // Mendapatkan daftar kamar yang sedang terisi (aktif) untuk pilihan dropdown
        $kamar = RiwayatSewa::with(['user', 'kamar'])
            ->where('status_sewa', 'aktif')
            ->get()
            ->map(function ($item) {
                return [
                    'id_user' => $item->id_user,
                    'nomor_kamar' => $item->kamar->nomor_kamar,
                    'penghuni' => $item->user->nama_lengkap
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $kamar
        ]);
    }
}
