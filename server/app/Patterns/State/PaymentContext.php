<?php

namespace App\Patterns\State;

use App\Models\Pembayaran;

class PaymentContext
{
    private PaymentStateInterface $state;

    public function __construct(Pembayaran $pembayaran)
    {
        $this->state = match ($pembayaran->status_verifikasi) {
            'pending' => new PendingPaymentState(),
            'diterima' => new DiterimaPaymentState(),
            'ditolak' => new DitolakPaymentState(),
            default => throw new \InvalidArgumentException('Status verifikasi pembayaran tidak valid.'),
        };
    }

    public function verify(Pembayaran $pembayaran, ?string $catatanAdmin): array
    {
        return $this->state->verify($pembayaran, $catatanAdmin);
    }

    public function reject(Pembayaran $pembayaran, ?string $catatanAdmin): array
    {
        return $this->state->reject($pembayaran, $catatanAdmin);
    }
}
