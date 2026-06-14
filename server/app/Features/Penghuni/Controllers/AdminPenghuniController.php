<?php

namespace App\Features\Penghuni\Controllers;

use App\Http\Controllers\Controller;
use App\Features\Penghuni\Services\AdminPenghuniService;
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

        $validated = $this->validatePagination($request, [
            'status' => ['nullable', Rule::in(['aktif', 'selesai', 'dibatalkan', 'all'])],
            'search' => ['nullable', 'string', 'max:100'],
        ], [
            'status.in' => 'Status penghuni tidak valid.',
        ]);

        $paginator = $this->adminPenghuniService->getPenghuniPaginated(
            $validated['status'] ?? 'aktif',
            $validated['search'] ?? null,
            $this->perPage($request)
        );

        return response()->json([
            'data' => $this->paginatedData($paginator),
            'meta' => $this->paginationMeta($paginator),
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
        ], [
            'nama_lengkap.required' => 'Nama lengkap wajib diisi.',
            'nama_lengkap.max' => 'Nama lengkap maksimal 255 karakter.',
            'no_hp.required' => 'Nomor HP wajib diisi.',
            'alamat_asal.required' => 'Alamat asal wajib diisi.',
            'alamat_asal.max' => 'Alamat asal maksimal 500 karakter.',
            'id_kamar.required' => 'Kamar wajib dipilih.',
            'id_kamar.exists' => 'Kamar yang dipilih tidak valid.',
            'tanggal_masuk.required' => 'Tanggal masuk wajib diisi.',
            'tanggal_masuk.date' => 'Tanggal masuk tidak valid.',
            'durasi_sewa_bulan.required' => 'Durasi sewa wajib diisi.',
            'durasi_sewa_bulan.integer' => 'Durasi sewa harus berupa angka.',
            'durasi_sewa_bulan.min' => 'Durasi sewa minimal 1 bulan.',
            'metode_pembayaran.required' => 'Metode pembayaran wajib dipilih.',
            'metode_pembayaran.in' => 'Metode pembayaran tidak valid.',
            'bukti_bayar.required' => 'Bukti pembayaran wajib diunggah.',
            'bukti_bayar.file' => 'Bukti pembayaran harus berupa file.',
            'bukti_bayar.mimes' => 'Bukti pembayaran harus berformat JPG, JPEG, PNG, atau PDF.',
            'bukti_bayar.max' => 'Bukti pembayaran maksimal 5MB.',
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
        ], [
            'tanggal_keluar.date' => 'Tanggal keluar tidak valid.',
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
