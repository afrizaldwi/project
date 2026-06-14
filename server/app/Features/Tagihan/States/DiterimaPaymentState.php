<?php

namespace App\Features\Tagihan\States;

use App\Features\Tagihan\Models\Pembayaran;

class DiterimaPaymentState implements PaymentStateInterface
{
    public function verify(Pembayaran $pembayaran, ?string $catatanAdmin): array
    {
        abort(422, 'Pembayaran ini sudah diproses dan diterima.');
    }

    public function reject(Pembayaran $pembayaran, ?string $catatanAdmin): array
    {
        abort(422, 'Pembayaran yang sudah diterima tidak dapat ditolak.');
    }
}
