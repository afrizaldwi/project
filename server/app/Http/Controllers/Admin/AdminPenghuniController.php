<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AdminPenghuniService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

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
            'no_hp' => ['required', 'string'],
            'alamat_asal' => ['required', 'string', 'max:500'],

            'id_kamar' => ['required', 'integer', Rule::exists('kamar', 'id_kamar')],
            'tanggal_masuk' => ['required', 'date'],
            'durasi_sewa_bulan' => ['required', 'integer', 'min:1'],

            'metode_pembayaran' => ['required', 'string', Rule::in(['Tunai', 'Transfer Bank', 'E-Wallet'])],
            'bukti_bayar' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        $validated['no_hp'] = $this->normalizeIndonesianPhoneNumber($validated['no_hp']);

        if (! $validated['no_hp']) {
            throw ValidationException::withMessages([
                'no_hp' => 'Nomor HP harus berupa nomor WhatsApp Indonesia yang valid.',
            ]);
        }

        return response()->json(
            $this->adminPenghuniService->createPenghuni(
                $validated,
                $request->file('bukti_bayar')
            ),
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

    private function normalizeIndonesianPhoneNumber(string $phoneNumber): ?string
    {
        $digits = preg_replace('/\D+/', '', $phoneNumber) ?? '';

        if (str_starts_with($digits, '0')) {
            $digits = '62' . substr($digits, 1);
        } elseif (str_starts_with($digits, '8')) {
            $digits = '62' . $digits;
        }

        if (! preg_match('/^628\d{8,11}$/', $digits)) {
            return null;
        }

        return $digits;
    }

    private function authorizeAdmin(Request $request): void
    {
        abort_unless($request->user()?->role === 'admin', 403, 'Akses hanya untuk admin.');
    }
}
