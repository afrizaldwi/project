<?php

namespace App\Services;

use App\Models\Kamar;
use App\Models\RiwayatSewa;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class PenghuniService
{
    public function getAll(): array
    {
        $aktif = RiwayatSewa::with(['user', 'kamar'])
            ->where('status_sewa', 'aktif')
            ->orderBy('tanggal_masuk', 'desc')
            ->get()
            ->map(fn($s) => $this->formatSewa($s));

        $alumni = RiwayatSewa::with(['user', 'kamar'])
            ->where('status_sewa', 'selesai')
            ->orderBy('tanggal_masuk', 'desc')
            ->get()
            ->map(fn($s) => $this->formatSewa($s));

        return ['aktif' => $aktif, 'alumni' => $alumni];
    }

    public function getById(int $id): RiwayatSewa
    {
        return RiwayatSewa::with(['user', 'kamar'])->findOrFail($id);
    }

    public function getByIdFormatted(int $id): array
    {
        $sewa = RiwayatSewa::with(['user', 'kamar'])->findOrFail($id);
        return $this->formatSewa($sewa);
    }

    public function create(array $data): RiwayatSewa
    {
        // Buat user penyewa
        $user = User::create([
            'nama_lengkap' => $data['nama_lengkap'],
            'no_hp'        => $data['no_hp'],
            'email'        => $data['email'],
            'password'     => Hash::make($data['password']),
            'alamat_asal'  => $data['alamat_asal'] ?? null,
            'role'         => 'penyewa',
        ]);

        // Hitung tanggal keluar
        $tanggalKeluar = Carbon::parse($data['tanggal_masuk'])
            ->addMonths($data['durasi_sewa_bulan'])
            ->toDateString();

        // Buat riwayat sewa
        $sewa = RiwayatSewa::create([
            'id_user'           => $user->id,
            'id_kamar'          => $data['id_kamar'],
            'tanggal_masuk'     => $data['tanggal_masuk'],
            'tanggal_keluar'    => $tanggalKeluar,
            'harga_deal'        => $data['harga_deal'],
            'durasi_sewa_bulan' => $data['durasi_sewa_bulan'],
            'status_sewa'       => 'aktif',
        ]);

        // Update status kamar menjadi terisi
        Kamar::where('id_kamar', $data['id_kamar'])->update(['status_kamar' => 'terisi']);

        return $sewa->load(['user', 'kamar']);
    }

    public function perpanjang(int $id, array $data): RiwayatSewa
    {
    $sewa = $this->getById($id);

    // Hitung durasi total = durasi lama + durasi perpanjangan baru
    $durasiTotal = $sewa->durasi_sewa_bulan + $data['durasi_sewa_bulan'];

    // Tanggal keluar dihitung dari tanggal masuk awal + total durasi
    $tanggalKeluar = Carbon::parse($sewa->tanggal_masuk)
        ->addMonths($durasiTotal)
        ->toDateString();

    $sewa->update([
    'tanggal_keluar'    => $tanggalKeluar,
    'durasi_sewa_bulan' => $sewa->durasi_sewa_bulan + $data['durasi_sewa_bulan'],
    'harga_deal'        => $sewa->harga_deal + $data['harga_deal'],
    'status_sewa'       => 'aktif',
    ]);

    return $sewa->fresh(['user', 'kamar']);
    }

    public function updateStatus(int $id, string $status): RiwayatSewa
    {
        $sewa = $this->getById($id);
        $sewa->update(['status_sewa' => $status]);

        // Update status kamar
        if ($status === 'selesai') {
            Kamar::where('id_kamar', $sewa->id_kamar)->update(['status_kamar' => 'tersedia']);
        } elseif ($status === 'aktif') {
            Kamar::where('id_kamar', $sewa->id_kamar)->update(['status_kamar' => 'terisi']);
        }

        return $sewa->fresh(['user', 'kamar']);
    }

    private function formatSewa(RiwayatSewa $sewa): array
    {
        return [
            'id_sewa'           => $sewa->id_sewa,
            'id_user'           => $sewa->id_user,
            'nama'              => $sewa->user->nama_lengkap ?? '-',
            'email'             => $sewa->user->email ?? '-',
            'no_hp'             => $sewa->user->no_hp ?? '-',
            'alamat_asal'       => $sewa->user->alamat_asal ?? '-',
            'nomor_kamar'       => $sewa->kamar->nomor_kamar ?? '-',
            'id_kamar'          => $sewa->id_kamar,
            'harga_deal'        => $sewa->harga_deal,
            'harga_bulanan'     => $sewa->kamar->harga_bulanan ?? 0,
            'tanggal_masuk'     => $sewa->tanggal_masuk,
            'tanggal_keluar'    => $sewa->tanggal_keluar ?? '-',
            'durasi_sewa_bulan' => $sewa->durasi_sewa_bulan,
            'status_sewa'       => $sewa->status_sewa,
        ];
    }
}