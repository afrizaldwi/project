<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Keluhan;
use App\Models\RiwayatSewa;
use App\Patterns\Strategy\AdminKeluhanStrategy;
use App\Patterns\Strategy\PenyewaKeluhanStrategy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class KeluhanController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $strategy = $user?->role === 'admin'
            ? new AdminKeluhanStrategy()
            : new PenyewaKeluhanStrategy((int) $user->id);

        $keluhan = $strategy
            ->query($request)
            ->orderByDesc('tanggal_lapor')
            ->get()
            ->map(fn(Keluhan $item) => $this->formatKeluhan($item));

        return response()->json([
            'status' => 'success',
            'data' => $keluhan,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user?->role !== 'penyewa') {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya penyewa yang dapat membuat laporan kerusakan.',
            ], 403);
        }

        $validated = $request->validate([
            'judul_keluhan' => ['required', 'string', 'max:150'],
            'deskripsi_keluhan' => ['required', 'string', 'max:2000'],
            'foto_kerusakan' => ['nullable', 'array', 'max:3'],
            'foto_kerusakan.*' => ['image', 'mimes:jpg,jpeg,png', 'max:5120'],
        ], [
            'judul_keluhan.required' => 'Judul keluhan wajib diisi.',
            'judul_keluhan.max' => 'Judul keluhan maksimal 150 karakter.',
            'deskripsi_keluhan.required' => 'Deskripsi keluhan wajib diisi.',
            'deskripsi_keluhan.max' => 'Deskripsi keluhan maksimal 2000 karakter.',
            'foto_kerusakan.max' => 'Foto kerusakan maksimal 3 file.',
            'foto_kerusakan.*.image' => 'Foto kerusakan harus berupa gambar.',
            'foto_kerusakan.*.mimes' => 'Foto kerusakan harus berformat JPG, JPEG, atau PNG.',
            'foto_kerusakan.*.max' => 'Setiap foto kerusakan maksimal 5MB.',
        ]);

        $sewaAktif = RiwayatSewa::where('id_user', $user->id)
            ->where('status_sewa', 'aktif')
            ->latest('tanggal_masuk')
            ->first();

        if (! $sewaAktif) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda belum memiliki sewa aktif untuk membuat laporan kerusakan.',
            ], 422);
        }

        $paths = [];
        if ($request->hasFile('foto_kerusakan')) {
            $files = $request->file('foto_kerusakan');
            if (is_array($files)) {
                foreach ($files as $file) {
                    $paths[] = $file->store('keluhan', 'public');
                }
            } else {
                $paths[] = $files->store('keluhan', 'public');
            }
        }

        $keluhan = Keluhan::create([
            'id_sewa' => $sewaAktif->id_sewa,
            'judul_keluhan' => $validated['judul_keluhan'],
            'deskripsi_keluhan' => $validated['deskripsi_keluhan'],
            'foto_kerusakan' => !empty($paths) ? implode(',', $paths) : null,
            'status_keluhan' => 'pending',
            'tanggal_lapor' => now(),
            'tanggal_selesai' => null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan kerusakan berhasil dikirim.',
            'data' => $this->formatKeluhan($keluhan->fresh([
                'riwayatSewa.user',
                'riwayatSewa.kamar',
            ])),
        ], 201);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if ($user?->role !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya admin yang dapat memperbarui status keluhan.',
            ], 403);
        }

        $validated = $request->validate([
            'status_keluhan' => [
                'required',
                Rule::in(['pending', 'proses', 'selesai']),
            ],
        ], [
            'status_keluhan.required' => 'Status keluhan wajib dipilih.',
            'status_keluhan.in' => 'Status keluhan tidak valid.',
        ]);

        $keluhan = Keluhan::with([
            'riwayatSewa.user',
            'riwayatSewa.kamar',
        ])->findOrFail($id);

        $keluhan->update([
            'status_keluhan' => $validated['status_keluhan'],
            'tanggal_selesai' => $validated['status_keluhan'] === 'selesai'
                ? now()
                : null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status keluhan berhasil diperbarui.',
            'data' => $this->formatKeluhan($keluhan->fresh([
                'riwayatSewa.user',
                'riwayatSewa.kamar',
            ])),
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = $request->user();

        if ($user?->role !== 'admin') {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya admin yang dapat menghapus keluhan.',
            ], 403);
        }

        $keluhan = Keluhan::findOrFail($id);

        if ($keluhan->foto_kerusakan) {
            $paths = explode(',', $keluhan->foto_kerusakan);
            foreach ($paths as $path) {
                Storage::disk('public')->delete(trim($path));
            }
        }

        $keluhan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Keluhan berhasil dihapus.',
        ]);
    }

    private function formatKeluhan(Keluhan $keluhan): array
    {
        return [
            'id_keluhan' => $keluhan->id_keluhan,
            'id_sewa' => $keluhan->id_sewa,
            'judul_keluhan' => $keluhan->judul_keluhan,
            'deskripsi_keluhan' => $keluhan->deskripsi_keluhan,
            'foto_kerusakan' => $keluhan->foto_kerusakan,
            'foto_kerusakan_url' => $keluhan->foto_kerusakan
                ? '/storage/' . $keluhan->foto_kerusakan
                : null,
            'status_keluhan' => $keluhan->status_keluhan,
            'tanggal_lapor' => $keluhan->tanggal_lapor,
            'tanggal_selesai' => $keluhan->tanggal_selesai,
            'nama_penghuni' => $keluhan->riwayatSewa?->user?->nama_lengkap ?? '-',
            'email_penghuni' => $keluhan->riwayatSewa?->user?->email ?? '-',
            'nomor_kamar' => $keluhan->riwayatSewa?->kamar?->nomor_kamar ?? '-',
        ];
    }
}
