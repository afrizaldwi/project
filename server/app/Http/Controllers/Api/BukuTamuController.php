<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BukuTamu;
use App\Models\RiwayatSewa;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BukuTamuController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = BukuTamu::with('dikunjungi');
        $user = $request->user();
        $isAdmin = $user?->role === 'admin';

        if ($isAdmin) {
            $this->validatePagination($request, [
                'search' => ['nullable', 'string', 'max:100'],
                'id_user' => ['nullable', 'integer', 'min:1'],
            ]);
        }

        if ($user?->role === 'penyewa') {
            $query->where('bertemu_dengan', $user->id);
        } elseif ($request->filled('id_user')) {
            $query->where('bertemu_dengan', $request->integer('id_user'));
        }

        if ($isAdmin) {
            $search = trim((string) $request->query('search', ''));

            if ($search !== '') {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('nama_tamu', 'like', "%{$search}%")
                        ->orWhere('no_hp_tamu', 'like', "%{$search}%")
                        ->orWhere('keperluan', 'like', "%{$search}%")
                        ->orWhereHas('dikunjungi', function (Builder $userQuery) use ($search) {
                            $userQuery->where('nama_lengkap', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        })
                        ->orWhereHas('dikunjungi.riwayatSewa', function (Builder $sewaQuery) use ($search) {
                            $sewaQuery->where('status_sewa', 'aktif')
                                ->whereHas('kamar', function (Builder $kamarQuery) use ($search) {
                                    $kamarQuery->where('nomor_kamar', 'like', "%{$search}%");
                                });
                        });
                });
            }

            $paginator = $query
                ->orderByDesc('waktu_berkunjung')
                ->paginate($this->perPage($request));
            $paginator->getCollection()->transform(
                fn(BukuTamu $item) => $this->formatTamu($item)
            );

            return response()->json([
                'data' => $this->paginatedData($paginator),
                'meta' => $this->paginationMeta($paginator),
                'summary' => $this->tamuSummary($query),
            ]);
        }

        $tamu = $query
            ->orderByDesc('waktu_berkunjung')
            ->get()
            ->map(fn(BukuTamu $item) => $this->formatTamu($item));

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

        $messages = [
            'nama_tamu.required' => 'Nama tamu wajib diisi.',
            'nama_tamu.max' => 'Nama tamu maksimal 100 karakter.',
            'no_hp_tamu.required' => 'Nomor HP tamu wajib diisi.',
            'no_hp_tamu.max' => 'Nomor HP tamu maksimal 20 karakter.',
            'keperluan.required' => 'Keperluan wajib diisi.',
            'keperluan.max' => 'Keperluan maksimal 1000 karakter.',
            'id_user.required' => 'Penghuni yang dikunjungi wajib dipilih.',
            'id_user.exists' => 'Penghuni yang dipilih tidak valid.',
        ];

        $validated = $request->validate($rules, $messages);

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

    private function tamuSummary($query): array
    {
        return [
            'total_tamu' => (clone $query)->count(),
            'total_penghuni_visited' => (clone $query)->distinct('bertemu_dengan')->count('bertemu_dengan'),
            'tamu_today' => (clone $query)->whereDate('waktu_berkunjung', now()->toDateString())->count(),
        ];
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
