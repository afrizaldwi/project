<?php

namespace App\Repositories\Eloquent;

use App\Models\RiwayatSewa;
use App\Repositories\Contracts\RiwayatSewaRepositoryInterface;
use Illuminate\Support\Collection;

class RiwayatSewaRepository implements RiwayatSewaRepositoryInterface
{
    public function findById(int $id): ?RiwayatSewa
    {
        return RiwayatSewa::find($id);
    }

    public function findByIdOrFail(int $id): RiwayatSewa
    {
        return RiwayatSewa::findOrFail($id);
    }

    public function findByIdWithRelations(int $id, array $relations): RiwayatSewa
    {
        return RiwayatSewa::with($relations)->findOrFail($id);
    }

    public function getActiveSewaWithRelations(array $relations): Collection
    {
        return RiwayatSewa::with($relations)
            ->where('status_sewa', 'aktif')
            ->orderByDesc('tanggal_masuk')
            ->get();
    }

    public function update(int $id, array $data): RiwayatSewa
    {
        $sewa = $this->findByIdOrFail($id);
        $sewa->update($data);

        return $sewa->fresh();
    }

    public function existsByKamarId(int $kamarId): bool
    {
        return RiwayatSewa::where('id_kamar', $kamarId)->exists();
    }

    public function lockForUpdate(int $id): RiwayatSewa
    {
        return RiwayatSewa::with(['user', 'kamar'])->lockForUpdate()->findOrFail($id);
    }
}
