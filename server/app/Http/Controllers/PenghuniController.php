<?php

namespace App\Http\Controllers;

use App\Http\Requests\PenghuniRequest;
use App\Http\Requests\PerpanjangRequest;
use App\Services\PenghuniService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PenghuniController extends Controller
{
    public function __construct(private PenghuniService $penghuniService) {}

    public function index(): JsonResponse
    {
        $data = $this->penghuniService->getAll();
        return response()->json($data);
    }

    public function show(int $id): JsonResponse
    {
        $sewa = $this->penghuniService->getByIdFormatted($id);
        return response()->json(['data' => $sewa]);
    }

    public function store(PenghuniRequest $request): JsonResponse
    {
        $sewa = $this->penghuniService->create($request->validated());
        return response()->json(['message' => 'Penghuni berhasil ditambahkan.', 'data' => $sewa], 201);
    }

    public function perpanjang(PerpanjangRequest $request, int $id): JsonResponse
    {
        $sewa = $this->penghuniService->perpanjang($id, $request->validated());
        return response()->json(['message' => 'Sewa berhasil diperpanjang.', 'data' => $sewa]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate(['status_sewa' => 'required|in:aktif,selesai,dibatalkan']);
        $sewa = $this->penghuniService->updateStatus($id, $request->status_sewa);
        return response()->json(['message' => 'Status berhasil diperbarui.', 'data' => $sewa]);
    }
}