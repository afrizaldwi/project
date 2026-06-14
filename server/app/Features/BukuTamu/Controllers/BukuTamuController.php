<?php

namespace App\Features\BukuTamu\Controllers;

use App\Features\BukuTamu\Requests\StoreBukuTamuRequest;
use App\Features\BukuTamu\Services\BukuTamuService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BukuTamuController extends Controller
{
    public function __construct(
        private readonly BukuTamuService $bukuTamuService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $isAdmin = $user?->role === 'admin';

        if ($isAdmin) {
            $this->validatePagination($request, [
                'search' => ['nullable', 'string', 'max:100'],
                'id_user' => ['nullable', 'integer', 'min:1'],
            ]);

            $paginator = $this->bukuTamuService->getPaginatedForAdmin($request);
            $summary = $this->bukuTamuService->getSummary($request);

            return response()->json([
                'data' => $this->paginatedData($paginator),
                'meta' => $this->paginationMeta($paginator),
                'summary' => $summary,
            ]);
        }

        $tamu = $this->bukuTamuService->getForPenyewa($request, $user->id);

        return response()->json([
            'status' => 'success',
            'data' => $tamu,
        ]);
    }

    public function penghuniAktif(): JsonResponse
    {
        $data = $this->bukuTamuService->getPenghuniAktif();

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    public function store(StoreBukuTamuRequest $request): JsonResponse
    {
        $user = $request->user();

        $idUser = $user?->role === 'penyewa'
            ? $user->id
            : (int) $request->validated()['id_user'];

        $tamu = $this->bukuTamuService->create($request->validated(), $idUser);

        return response()->json([
            'status' => 'success',
            'message' => 'Data tamu berhasil disimpan.',
            'data' => $this->bukuTamuService->formatTamu($tamu->fresh('dikunjungi')),
        ], 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->bukuTamuService->delete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Data tamu berhasil dihapus.',
        ]);
    }
}
