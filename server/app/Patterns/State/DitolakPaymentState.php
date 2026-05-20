<?php

namespace App\Patterns\State;

use App\Models\Pembayaran;

class DitolakPaymentState implements PaymentStateInterface
{
    public function verify(Pembayaran $pembayaran, ?string $catatanAdmin): array
    {
        abort(422, 'Pembayaran yang sudah ditolak tidak dapat diterima.');
    }

    public function reject(Pembayaran $pembayaran, ?string $catatanAdmin): array
    {
        abort(422, 'Pembayaran ini sudah diproses dan ditolak.');
    }
}
