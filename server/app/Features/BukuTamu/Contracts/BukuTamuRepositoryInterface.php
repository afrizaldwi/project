<?php

namespace App\Features\BukuTamu\Contracts;

use App\Features\BukuTamu\Models\BukuTamu;

interface BukuTamuRepositoryInterface
{
    public function findByIdOrFail(int $id): BukuTamu;

    public function create(array $data): BukuTamu;

    public function delete(int $id): bool;
}
