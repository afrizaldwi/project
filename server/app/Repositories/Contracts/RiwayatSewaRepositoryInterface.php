<?php

namespace App\Repositories\Contracts;

use App\Models\RiwayatSewa;
use Illuminate\Support\Collection;

interface RiwayatSewaRepositoryInterface
{
    public function findById(int $id): ?RiwayatSewa;

    public function findByIdOrFail(int $id): RiwayatSewa;

    public function findByIdWithRelations(int $id, array $relations): RiwayatSewa;

    public function getActiveSewaWithRelations(array $relations): Collection;

    public function update(int $id, array $data): RiwayatSewa;

    public function existsByKamarId(int $kamarId): bool;

    public function lockForUpdate(int $id): RiwayatSewa;
}
