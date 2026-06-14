<?php

namespace App\Features\Kamar\Contracts;

use App\Features\Kamar\Models\Kamar;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface KamarRepositoryInterface
{
    public function all(): Collection;

    public function paginate(?string $search = null, ?string $status = null, int $perPage = 10): LengthAwarePaginator;

    public function getAvailableRooms(): Collection;

    public function findById(int $id): ?Kamar;

    public function findByIdOrFail(int $id): Kamar;

    public function create(array $data): Kamar;

    public function update(int $id, array $data): Kamar;

    public function delete(int $id): bool;

    public function countByStatus(string $status): int;

    public function hasRentalHistory(int $id): bool;
}
