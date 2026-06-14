<?php

namespace App\Features\Sewa\Controllers;

use App\Features\Sewa\Requests\PerpanjangRequest;
use App\Features\Sewa\Services\SewaExtensionService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class SewaExtensionController extends Controller
{
    public function __construct(private readonly SewaExtensionService $sewaExtensionService) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => $this->sewaExtensionService->getActiveSewaList(),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        return response()->json([
            'data' => $this->sewaExtensionService->getSewaForExtension($id),
        ]);
    }

    public function perpanjang(PerpanjangRequest $request, int $id): JsonResponse
    {
        try {
            $result = $this->sewaExtensionService->perpanjang(
                $id,
                $request->validated()
            );

            return response()->json([
                'message' => 'Sewa berhasil diperpanjang dan tagihan baru berhasil dibuat.',
                'data' => $result,
            ]);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 422);
        }
    }
}
