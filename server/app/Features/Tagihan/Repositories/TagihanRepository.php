<?php

namespace App\Features\Tagihan\Repositories;

use App\Features\Tagihan\Contracts\TagihanRepositoryInterface;
use App\Models\Tagihan;

class TagihanRepository implements TagihanRepositoryInterface
{
    public function create(array $data): Tagihan
    {
        return Tagihan::create($data);
    }

    public function invoiceCodeExists(string $code): bool
    {
        return Tagihan::where('kode_invoice', $code)->exists();
    }
}
