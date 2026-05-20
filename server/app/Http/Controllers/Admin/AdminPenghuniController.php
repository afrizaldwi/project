<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AdminPenghuniService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminPenghuniController extends Controller
{
    public function __construct(
        private AdminPenghuniService $adminPenghuniService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'status' => ['nullable', Rule::in(['aktif', 'selesai', 'dibatalkan', 'all'])],
        ]);

        return response()->json([
            'data' => $this->adminPenghuniService->getPenghuni(
                $validated['status'] ?? 'aktif'
            ),
        ]);
    }

    public function availableRooms(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        return response()->json([
            'data' => $this->adminPenghuniService->getKamarTersedia(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8'],
            'no_hp' => ['required', 'string', 'max:20'],
            'alamat_asal' => ['nullable', 'string'],

            'id_kamar' => ['required', 'integer', Rule::exists('kamar', 'id_kamar')],
            'tanggal_masuk' => ['required', 'date'],
            'durasi_sewa_bulan' => ['required', 'integer', 'min:1'],
        ]);

        return response()->json(
            $this->adminPenghuniService->createPenghuni($validated),
            201
        );
    }

    public function finishSewa(Request $request, int $idSewa): JsonResponse
    {
        $this->authorizeAdmin($request);

        $validated = $request->validate([
            'tanggal_keluar' => ['nullable', 'date'],
        ]);

        return response()->json(
            $this->adminPenghuniService->finishSewa(
                $idSewa,
                $validated['tanggal_keluar'] ?? null
            )
        );
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Akses hanya untuk admin.');
    }
}
