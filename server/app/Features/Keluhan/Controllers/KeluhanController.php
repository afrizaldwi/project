<?php

namespace App\Features\Keluhan\Controllers;

use App\Features\Keluhan\Requests\StoreKeluhanRequest;
use App\Features\Keluhan\Requests\UpdateStatusKeluhanRequest;
use App\Features\Keluhan\Services\KeluhanService;
use App\Http\Controllers\Controller;
use App\Features\Sewa\Models\RiwayatSewa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class KeluhanController extends Controller
{
    public function __construct(
        private readonly KeluhanService $keluhanService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $isAdmin = $user?->role === 'admin';

        if ($isAdmin) {
            $this->validatePagination($request, [
                'search' => ['nullable', 'string', 'max:100'],
                'status' => ['nullable', Rule::in(['pending', 'proses', 'selesai', 'semua'])],
            ]);

            [$paginator, $summary] = $this->keluhanService->getPaginatedForAdmin($request);

            return response()->json([
                'data' => $this->paginatedData($paginator),
                'meta' => $this->paginationMeta($paginator),
                'summary' => $summary,
            ]);
        }

        $request->validate([
            'status' => ['nullable', Rule::in(['pending', 'proses', 'selesai', 'semua'])],
        ]);

        $keluhan = $this->keluhanService->getForPenyewa($request, $user->id);

        return response()->json([
            'status' => 'success',
            'data' => $keluhan,
        ]);
    }

    public function store(StoreKeluhanRequest $request): JsonResponse
    {
        $user = $request->user();

        $sewaAktif = RiwayatSewa::where('id_user', $user->id)
            ->where('status_sewa', 'aktif')
            ->latest('tanggal_masuk')
            ->first();

        if (!$sewaAktif) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda belum memiliki sewa aktif untuk membuat laporan kerusakan.',
            ], 422);
        }

        $keluhan = $this->keluhanService->create(
            $request->validated(),
            $sewaAktif->id_sewa,
            $request->file('foto_kerusakan')
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan kerusakan berhasil dikirim.',
            'data' => $this->keluhanService->formatKeluhan($keluhan->fresh([
                'riwayatSewa.user',
                'riwayatSewa.kamar',
            ])),
        ], 201);
    }

    public function updateStatus(UpdateStatusKeluhanRequest $request, int $id): JsonResponse
    {
        $keluhan = $this->keluhanService->updateStatus(
            $id,
            $request->validated()['status_keluhan']
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Status keluhan berhasil diperbarui.',
            'data' => $this->keluhanService->formatKeluhan($keluhan->fresh([
                'riwayatSewa.user',
                'riwayatSewa.kamar',
            ])),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->keluhanService->delete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Keluhan berhasil dihapus.',
        ]);
    }
}
