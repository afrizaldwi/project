<?php

namespace App\Features\Kamar\Controllers;

use App\Features\Kamar\Requests\KamarRequest;
use App\Features\Kamar\Services\KamarService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use RuntimeException;

class KamarController extends Controller
{
    public function __construct(private readonly KamarService $kamarService) {}

    public function index(Request $request): JsonResponse
    {
        $validated = $this->validatePagination($request, [
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(['tersedia', 'terisi', 'perbaikan', 'semua'])],
        ]);

        $paginator = $this->kamarService->getPaginated(
            $validated['search'] ?? null,
            $validated['status'] ?? null,
            $this->perPage($request)
        );

        return response()->json(array_merge([
            'data' => $this->paginatedData($paginator),
            'meta' => $this->paginationMeta($paginator),
        ], $this->kamarService->getStats()));
    }

    public function publicRoomTypes(): JsonResponse
    {
        return response()->json(
            $this->kamarService->getGroupedRoomTypes()
        );
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
