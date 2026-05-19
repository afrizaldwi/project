<?php

namespace App\Http\Controllers;

use App\Http\Requests\KamarRequest;
use App\Services\KamarService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class KamarController extends Controller
{
    public function __construct(private readonly KamarService $kamarService) {}

    public function index(): JsonResponse
    {
        return response()->json($this->kamarService->getAll());
    }

    public function show(int $id): JsonResponse
    {
        return response()->json([
            'data' => $this->kamarService->getById($id),
        ]);
    }

    public function store(KamarRequest $request): JsonResponse
    {
        $kamar = $this->kamarService->create(
            $request->validated(),
            $request->file('foto_kamar')
        );

        return response()->json([
            'message' => 'Kamar berhasil ditambahkan.',
            'data' => $kamar,
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
            'data' => $kamar,
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->kamarService->delete($id);

            return response()->json([
                'message' => 'Kamar berhasil dihapus.',
            ]);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }
    }
}
