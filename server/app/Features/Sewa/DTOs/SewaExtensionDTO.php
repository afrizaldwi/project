<?php

namespace App\Features\Sewa\DTOs;

use Carbon\Carbon;

readonly class SewaExtensionDTO
{
    public function __construct(
        public Carbon $tanggal_mulai,
        public int $durasi_sewa_bulan,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            tanggal_mulai: Carbon::parse($data['tanggal_mulai'])->startOfDay(),
            durasi_sewa_bulan: (int) $data['durasi_sewa_bulan'],
        );
    }

    public function toArray(): array
    {
        return [
            'tanggal_mulai' => $this->tanggal_mulai->toDateString(),
            'durasi_sewa_bulan' => $this->durasi_sewa_bulan,
        ];
    }
}
