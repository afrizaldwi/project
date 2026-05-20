<?php

namespace App\DTO;

use App\Models\RiwayatSewa;

readonly class SewaDetailDTO
{
    public function __construct(
        public int $id_sewa,
        public int $id_user,
        public int $id_kamar,
        public string $nama,
        public string $email,
        public string $no_hp,
        public string $nomor_kamar,
        public float $harga_bulanan,
        public float $harga_deal,
        public ?string $tanggal_masuk,
        public ?string $tanggal_keluar,
        public int $durasi_sewa_bulan,
        public string $status_sewa,
    ) {}

    public static function fromModel(RiwayatSewa $sewa, ?string $tanggalKeluar = null): self
    {
        return new self(
            id_sewa: $sewa->id_sewa,
            id_user: $sewa->id_user,
            id_kamar: $sewa->id_kamar,
            nama: $sewa->user->nama_lengkap ?? '-',
            email: $sewa->user->email ?? '-',
            no_hp: $sewa->user->no_hp ?? '-',
            nomor_kamar: $sewa->kamar->nomor_kamar ?? '-',
            harga_bulanan: (float) ($sewa->kamar->harga_bulanan ?? 0),
            harga_deal: (float) $sewa->harga_deal,
            tanggal_masuk: $sewa->tanggal_masuk,
            tanggal_keluar: $tanggalKeluar,
            durasi_sewa_bulan: (int) $sewa->durasi_sewa_bulan,
            status_sewa: $sewa->status_sewa,
        );
    }

    public function toArray(): array
    {
        return [
            'id_sewa' => $this->id_sewa,
            'id_user' => $this->id_user,
            'id_kamar' => $this->id_kamar,
            'nama' => $this->nama,
            'email' => $this->email,
            'no_hp' => $this->no_hp,
            'nomor_kamar' => $this->nomor_kamar,
            'harga_bulanan' => $this->harga_bulanan,
            'harga_deal' => $this->harga_deal,
            'tanggal_masuk' => $this->tanggal_masuk,
            'tanggal_keluar' => $this->tanggal_keluar,
            'durasi_sewa_bulan' => $this->durasi_sewa_bulan,
            'status_sewa' => $this->status_sewa,
        ];
    }
}
