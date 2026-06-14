<?php

namespace App\Features\Keluhan\Services;

use App\Features\Keluhan\Contracts\KeluhanRepositoryInterface;
use App\Features\Keluhan\Models\Keluhan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class KeluhanService
{
    public function __construct(
        private readonly KeluhanRepositoryInterface $repository
    ) {}

    public function getPaginatedForAdmin(Request $request): array
    {
        $strategy = new AdminKeluhanStrategy();
        $query = $strategy->query($request)
            ->orderByDesc('tanggal_lapor')
            ->orderByDesc('id_keluhan');

        $paginator = $query->paginate((int) $request->query('per_page', 10));
        $paginator = $paginator->through(fn(Keluhan $item) => $this->formatKeluhan($item));

        $summary = $this->getSummary(clone $query);

        return [$paginator, $summary];
    }

    public function getForPenyewa(Request $request, int $userId): array
    {
        $strategy = new PenyewaKeluhanStrategy($userId);
        $query = $strategy->query($request)
            ->orderByDesc('tanggal_lapor')
            ->orderByDesc('id_keluhan');

        return $query->get()
            ->map(fn(Keluhan $item) => $this->formatKeluhan($item))
            ->toArray();
    }

    public function create(array $data, int $sewaId, ?array $photos): Keluhan
    {
        $paths = [];
        if ($photos) {
            foreach ($photos as $file) {
                $paths[] = $file->store('keluhan', 'public');
            }
        }

        return $this->repository->create([
            'id_sewa' => $sewaId,
            'judul_keluhan' => $data['judul_keluhan'],
            'deskripsi_keluhan' => $data['deskripsi_keluhan'],
            'foto_kerusakan' => !empty($paths) ? implode(',', $paths) : null,
            'status_keluhan' => 'pending',
            'tanggal_lapor' => now(),
            'tanggal_selesai' => null,
        ]);
    }

    public function updateStatus(int $id, string $status): Keluhan
    {
        $data = [
            'status_keluhan' => $status,
            'tanggal_selesai' => $status === 'selesai' ? now() : null,
        ];

        return $this->repository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $keluhan = $this->repository->findByIdOrFail($id);

        if ($keluhan->foto_kerusakan) {
            $paths = explode(',', $keluhan->foto_kerusakan);
            foreach ($paths as $path) {
                Storage::disk('public')->delete(trim($path));
            }
        }

        $this->repository->delete($id);
    }

    public function formatKeluhan(Keluhan $keluhan): array
    {
        return [
            'id_keluhan' => $keluhan->id_keluhan,
            'id_sewa' => $keluhan->id_sewa,
            'judul_keluhan' => $keluhan->judul_keluhan,
            'deskripsi_keluhan' => $keluhan->deskripsi_keluhan,
            'foto_kerusakan' => $keluhan->foto_kerusakan,
            'foto_kerusakan_url' => $keluhan->foto_kerusakan
                ? '/storage/' . $keluhan->foto_kerusakan
                : null,
            'status_keluhan' => $keluhan->status_keluhan,
            'tanggal_lapor' => $keluhan->tanggal_lapor,
            'tanggal_selesai' => $keluhan->tanggal_selesai,
            'nama_penghuni' => $keluhan->riwayatSewa?->user?->nama_lengkap ?? '-',
            'email_penghuni' => $keluhan->riwayatSewa?->user?->email ?? '-',
            'nomor_kamar' => $keluhan->riwayatSewa?->kamar?->nomor_kamar ?? '-',
        ];
    }

    private function getSummary($query): array
    {
        return [
            'total' => (clone $query)->count(),
            'pending' => (clone $query)->where('status_keluhan', 'pending')->count(),
            'proses' => (clone $query)->where('status_keluhan', 'proses')->count(),
            'selesai' => (clone $query)->where('status_keluhan', 'selesai')->count(),
        ];
    }
}
