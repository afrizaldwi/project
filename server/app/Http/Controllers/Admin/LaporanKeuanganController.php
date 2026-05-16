<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\LaporanKeuanganService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LaporanKeuanganController extends Controller
{
    public function __construct(
        private LaporanKeuanganService $laporanKeuanganService
    ) {}

    public function summary(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'bulan' => ['nullable', 'integer', 'min:1', 'max:12'],
            'tahun' => ['nullable', 'integer', 'min:2000', 'max:2100'],
        ]);

        return response()->json(
            $this->laporanKeuanganService->getSummary(
                $validated['bulan'] ?? null,
                $validated['tahun'] ?? null
            )
        );
    }

    public function pengeluaran(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'bulan' => ['nullable', 'integer', 'min:1', 'max:12'],
            'tahun' => ['nullable', 'integer', 'min:2000', 'max:2100'],
        ]);

        return response()->json([
            'data' => $this->laporanKeuanganService->getPengeluaran(
                $validated['bulan'] ?? null,
                $validated['tahun'] ?? null
            ),
        ]);
    }

    public function storePengeluaran(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'judul_pengeluaran' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'jumlah_pengeluaran' => ['required', 'numeric', 'min:0'],
            'tanggal_pengeluaran' => ['required', 'date'],
            'bukti_foto' => ['nullable', 'string'],
        ]);

        $validated['dibuat_oleh'] = $request->user()->id;

        return response()->json(
            $this->laporanKeuanganService->createPengeluaran($validated),
            201
        );
    }

    public function destroyPengeluaran(Request $request, int $idPengeluaran): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json(
            $this->laporanKeuanganService->deletePengeluaran($idPengeluaran)
        );
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Akses hanya untuk admin.');
    }
}
