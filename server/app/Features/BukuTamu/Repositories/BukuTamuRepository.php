<?php

namespace App\Features\BukuTamu\Repositories;

use App\Features\BukuTamu\Contracts\BukuTamuRepositoryInterface;
use App\Features\BukuTamu\Models\BukuTamu;

class BukuTamuRepository implements BukuTamuRepositoryInterface
{
    public function findByIdOrFail(int $id): BukuTamu
    {
        return BukuTamu::findOrFail($id);
    }

    public function create(array $data): BukuTamu
    {
        return BukuTamu::create($data);
    }

    public function delete(int $id): bool
    {
        $tamu = $this->findByIdOrFail($id);

        return $tamu->delete();
    }
}
