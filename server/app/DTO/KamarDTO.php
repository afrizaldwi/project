<?php

namespace App\DTO;

use App\Models\Kamar;

readonly class KamarDTO
{
    public function __construct(
        public string $nomor_kamar,
        public string $luas_kamar,
        public string $fasilitas,
        public float $harga_bulanan,
        public string $status_kamar,
        public ?string $foto_kamar = null,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            nomor_kamar: $data['nomor_kamar'],
            luas_kamar: $data['luas_kamar'],
            fasilitas: $data['fasilitas'],
            harga_bulanan: (float) $data['harga_bulanan'],
            status_kamar: $data['status_kamar'],
            foto_kamar: $data['foto_kamar'] ?? null,
        );
    }

    public static function fromModel(Kamar $kamar): self
    {
        return new self(
            nomor_kamar: $kamar->nomor_kamar,
            luas_kamar: $kamar->luas_kamar,
            fasilitas: $kamar->fasilitas,
            harga_bulanan: (float) $kamar->harga_bulanan,
            status_kamar: $kamar->status_kamar,
            foto_kamar: $kamar->foto_kamar,
        );
    }

    public function toArray(): array
    {
        return [
            'nomor_kamar' => $this->nomor_kamar,
            'luas_kamar' => $this->luas_kamar,
            'fasilitas' => $this->fasilitas,
            'harga_bulanan' => $this->harga_bulanan,
            'status_kamar' => $this->status_kamar,
            'foto_kamar' => $this->foto_kamar,
        ];
    }
}
