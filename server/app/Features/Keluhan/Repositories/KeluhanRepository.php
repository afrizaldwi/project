<?php

namespace App\Features\Keluhan\Repositories;

use App\Features\Keluhan\Contracts\KeluhanRepositoryInterface;
use App\Features\Keluhan\Models\Keluhan;

class KeluhanRepository implements KeluhanRepositoryInterface
{
    public function findByIdOrFail(int $id): Keluhan
    {
        return Keluhan::findOrFail($id);
    }

    public function findWithRelations(int $id): Keluhan
    {
        return Keluhan::with([
            'riwayatSewa.user',
            'riwayatSewa.kamar',
        ])->findOrFail($id);
    }

    public function create(array $data): Keluhan
    {
        return Keluhan::create($data);
    }

    public function update(int $id, array $data): Keluhan
    {
        $keluhan = $this->findByIdOrFail($id);
        $keluhan->update($data);

        return $keluhan->fresh();
    }

    public function delete(int $id): bool
    {
        $keluhan = $this->findByIdOrFail($id);

        return $keluhan->delete();
    }
}
