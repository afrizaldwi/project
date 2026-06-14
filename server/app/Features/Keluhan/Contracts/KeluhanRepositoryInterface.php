<?php

namespace App\Features\Keluhan\Contracts;

use App\Features\Keluhan\Models\Keluhan;

interface KeluhanRepositoryInterface
{
    public function findByIdOrFail(int $id): Keluhan;

    public function findWithRelations(int $id): Keluhan;

    public function create(array $data): Keluhan;

    public function update(int $id, array $data): Keluhan;

    public function delete(int $id): bool;
}
