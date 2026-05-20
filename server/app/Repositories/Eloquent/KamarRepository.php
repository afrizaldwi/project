<?php

namespace App\Repositories\Eloquent;

use App\Models\Kamar;
use App\Models\RiwayatSewa;
use App\Repositories\Contracts\KamarRepositoryInterface;
use Illuminate\Support\Collection;

class KamarRepository implements KamarRepositoryInterface
{
    public function all(): Collection
    {
        return Kamar::orderBy('nomor_kamar')->get();
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
