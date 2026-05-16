<?php

namespace App\Http\Controllers;

use App\Http\Requests\KamarRequest;
use App\Services\KamarService;
use Illuminate\Http\JsonResponse;

class KamarController extends Controller
{
    public function __construct(private KamarService $kamarService) {}

    public function index(): JsonResponse
    {
        $result = $this->kamarService->getAll();

        return response()->json($result);
    }

    public function show(int $id): JsonResponse
    {
        $kamar = $this->kamarService->getById($id);

        return response()->json(['data' => $kamar]);
    }

    public function store(KamarRequest $request): JsonResponse
    {
        $kamar = $this->kamarService->create(
            $request->validated(),
            $request->file('foto_kamar')
        );

        return response()->json([
            'message' => 'Kamar berhasil ditambahkan.',
            'data'    => $kamar,
        ], 201);
    }

    public function update(KamarRequest $request, int $id): JsonResponse
    {
        $kamar = $this->kamarService->update(
            $id,
            $request->validated(),
            $request->file('foto_kamar')
        );

        return response()->json([
            'message' => 'Kamar berhasil diperbarui.',
            'data'    => $kamar,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->kamarService->delete($id);
            return response()->json(['message' => 'Kamar berhasil dihapus.']);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}  // ← ini penutup class, jangan sampai terhapus