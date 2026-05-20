<?php

namespace App\Patterns\State;

use App\Models\Pembayaran;

interface PaymentStateInterface
{
    public function verify(Pembayaran $pembayaran, ?string $catatanAdmin): array;
    public function reject(Pembayaran $pembayaran, ?string $catatanAdmin): array;
}
