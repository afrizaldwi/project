<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BukuTamu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BukuTamuController extends Controller
{
    public function index(Request $request)
    {
        $query = BukuTamu::with(['dikunjungi.riwayatSewa.kamar']);

        if ($request->has('id_user')) {
            $query->where('bertemu_dengan', $request->id_user);
        }

        $tamu = $query->orderBy('waktu_berkunjung', 'desc')
            ->get()
            ->map(function ($item) {
                $sewaAktif = $item->dikunjungi ? $item->dikunjungi->riwayatSewa->where('status_sewa', 'aktif')->first() : null;
                
                return [
                    'id_tamu' => $item->id_tamu,
                    'nama_tamu' => $item->nama_tamu,
                    'no_hp_tamu' => $item->no_hp_tamu ?? '-',
                    'keperluan' => $item->keperluan,
                    'waktu_berkunjung' => $item->waktu_berkunjung,
                    'id_user' => $item->bertemu_dengan,
                    'nama_penghuni' => $item->dikunjungi ? $item->dikunjungi->nama_lengkap : '-',
                    'nomor_kamar' => ($sewaAktif && $sewaAktif->kamar) ? $sewaAktif->kamar->nomor_kamar : '-'
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $tamu
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_tamu' => 'required|string|max:100',
            'no_hp_tamu' => 'required|string|max:12',
            'id_user' => 'required|exists:users,id',
            'keperluan' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 400);
        }

        $tamu = BukuTamu::create([
            'nama_tamu' => $request->nama_tamu,
            'no_hp_tamu' => $request->no_hp_tamu,
            'bertemu_dengan' => $request->id_user,
            'keperluan' => $request->keperluan,
            'waktu_berkunjung' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data tamu berhasil disimpan',
            'data' => $tamu
        ]);
    }

    public function destroy($id)
    {
        $tamu = BukuTamu::findOrFail($id);
        $tamu->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data tamu berhasil dihapus'
        ]);
    }
}
