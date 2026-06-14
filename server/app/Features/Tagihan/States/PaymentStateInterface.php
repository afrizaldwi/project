<?php

namespace App\Features\Tagihan\States;

use App\Features\Tagihan\Models\Pembayaran;

interface PaymentStateInterface
{
    public function verify(Pembayaran $pembayaran, ?string $catatanAdmin): array;
    public function reject(Pembayaran $pembayaran, ?string $catatanAdmin): array;
}
