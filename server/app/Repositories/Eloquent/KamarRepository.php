<?php

namespace App\Repositories\Eloquent;

use App\Models\Kamar;
use App\Models\RiwayatSewa;
use App\Repositories\Contracts\KamarRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class KamarRepository implements KamarRepositoryInterface
{
    public function all(): Collection
    {
        return Kamar::orderBy('nomor_kamar')->get();
    }

    public function paginate(?string $search = null, ?string $status = null, int $perPage = 10): LengthAwarePaginator
    {
        $query = Kamar::query();
        $search = trim((string) $search);
        $status = trim((string) $status);

        if ($search !== '') {
            $query->where('nomor_kamar', 'like', "%{$search}%");
        }

        if ($status !== '' && $status !== 'semua') {
            $query->where('status_kamar', $status);
        }

        return $query->orderBy('nomor_kamar')->paginate($perPage);
    }

    public function getAvailableRooms(): Collection
    {
        return Kamar::query()
            ->where('status_kamar', 'tersedia')
            ->orderBy('nomor_kamar')
            ->get();
    }

    public function findById(int $id): ?Kamar
    {
        return Kamar::find($id);
    }

    public function findByIdOrFail(int $id): Kamar
    {
        return Kamar::findOrFail($id);
    }

    public function create(array $data): Kamar
    {
        return Kamar::create($data);
    }

    public function update(int $id, array $data): Kamar
    {
        $kamar = $this->findByIdOrFail($id);
        $kamar->update($data);

        return $kamar->fresh();
    }

    public function delete(int $id): bool
    {
        $kamar = $this->findByIdOrFail($id);

        return $kamar->delete();
    }

    public function countByStatus(string $status): int
    {
        return Kamar::where('status_kamar', $status)->count();
    }

    public function hasRentalHistory(int $id): bool
    {
        return RiwayatSewa::where('id_kamar', $id)->exists();
    }
}
