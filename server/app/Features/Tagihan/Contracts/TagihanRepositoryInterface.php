<?php

namespace App\Features\Tagihan\Contracts;

use App\Models\Tagihan;

interface TagihanRepositoryInterface
{
    public function create(array $data): Tagihan;

    public function invoiceCodeExists(string $code): bool;
}
