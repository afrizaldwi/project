<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BukuTamu;
use App\Models\RiwayatSewa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BukuTamuController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BukuTamu::with('dikunjungi')
            ->orderByDesc('waktu_berkunjung');

        $user = $request->user();

        if ($user?->role === 'penyewa') {
            $query->where('bertemu_dengan', $user->id);
        } elseif ($request->filled('id_user')) {
            $query->where('bertemu_dengan', $request->integer('id_user'));
        }

        $tamu = $query->get()->map(fn(BukuTamu $item) => $this->formatTamu($item));

        return response()->json([
            'status' => 'success',
            'data' => $tamu,
        ]);
    }

    public function penghuniAktif(): JsonResponse
    {
        $data = RiwayatSewa::with(['user', 'kamar'])
            ->where('status_sewa', 'aktif')
            ->orderByDesc('tanggal_masuk')
            ->get()
            ->map(function (RiwayatSewa $sewa) {
                return [
                    'id_user' => $sewa->id_user,
                    'nama_penghuni' => $sewa->user->nama_lengkap ?? '-',
                    'email' => $sewa->user->email ?? '-',
                    'nomor_kamar' => $sewa->kamar->nomor_kamar ?? '-',
                ];
            })
            ->values();

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $rules = [
            'nama_tamu' => ['required', 'string', 'max:100'],
            'no_hp_tamu' => ['required', 'string', 'max:20'],
            'keperluan' => ['required', 'string', 'max:1000'],
        ];

        if ($user?->role === 'admin') {
            $rules['id_user'] = [
                'required',
                Rule::exists('users', 'id')->where('role', 'penyewa'),
            ];
        }

        $validated = $request->validate($rules);

        $idUser = $user?->role === 'penyewa'
            ? $user->id
            : (int) $validated['id_user'];

        $tamu = BukuTamu::create([
            'nama_tamu' => $validated['nama_tamu'],
            'no_hp_tamu' => $validated['no_hp_tamu'],
            'bertemu_dengan' => $idUser,
            'keperluan' => $validated['keperluan'],
            'waktu_berkunjung' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Data tamu berhasil disimpan.',
            'data' => $this->formatTamu($tamu->fresh('dikunjungi')),
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $tamu = BukuTamu::findOrFail($id);
        $tamu->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data tamu berhasil dihapus.',
        ]);
    }

    private function formatTamu(BukuTamu $item): array
    {
        $sewaAktif = RiwayatSewa::with('kamar')
            ->where('id_user', $item->bertemu_dengan)
            ->where('status_sewa', 'aktif')
            ->latest('tanggal_masuk')
            ->first();

        return [
            'id_tamu' => $item->id_tamu,
            'nama_tamu' => $item->nama_tamu,
            'no_hp_tamu' => $item->no_hp_tamu ?? '-',
            'keperluan' => $item->keperluan,
            'waktu_berkunjung' => $item->waktu_berkunjung,
            'id_user' => $item->bertemu_dengan,
            'nama_penghuni' => $item->dikunjungi->nama_lengkap ?? '-',
            'nomor_kamar' => $sewaAktif?->kamar?->nomor_kamar ?? '-',
        ];
    }
}
