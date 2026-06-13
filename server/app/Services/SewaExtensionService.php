<?php

namespace App\Services;

use App\DTO\SewaDetailDTO;
use App\DTO\SewaExtensionDTO;
use App\Models\RiwayatSewa;
use App\Repositories\Contracts\RiwayatSewaRepositoryInterface;
use App\Repositories\Contracts\TagihanRepositoryInterface;
use App\Services\Strategies\Contracts\DateCalculationStrategy;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class SewaExtensionService
{
    public function __construct(
        private readonly RiwayatSewaRepositoryInterface $sewaRepository,
        private readonly TagihanRepositoryInterface $tagihanRepository,
        private readonly DateCalculationStrategy $dateCalculation
    ) {}

    public function getActiveSewaList(): array
    {
        $sewaList = $this->sewaRepository->getActiveSewaWithRelations(['user', 'kamar']);

        return $sewaList->map(function (RiwayatSewa $sewa) {
            $tanggalKeluar = $this->resolveTanggalKeluar($sewa);

            return SewaDetailDTO::fromModel($sewa, $tanggalKeluar?->toDateString())->toArray();
        })->toArray();
    }

    public function getSewaForExtension(int $id): array
    {
        $sewa = $this->sewaRepository->findByIdWithRelations($id, ['user', 'kamar']);
        $tanggalKeluar = $this->resolveTanggalKeluar($sewa);

        return SewaDetailDTO::fromModel($sewa, $tanggalKeluar?->toDateString())->toArray();
    }

    public function perpanjang(int $id, array $data): array
    {
        $extensionDTO = SewaExtensionDTO::fromArray($data);

        return DB::transaction(function () use ($id, $extensionDTO) {
            $sewa = $this->sewaRepository->lockForUpdate($id);

            if ($sewa->status_sewa !== 'aktif') {
                throw new RuntimeException('Sewa tidak dapat diperpanjang karena statusnya tidak aktif.');
            }

            $tanggalKeluarLama = $this->resolveTanggalKeluar($sewa);

            if (! $tanggalKeluarLama) {
                throw new RuntimeException('Tanggal keluar sewa tidak dapat dihitung.');
            }

            if (! $extensionDTO->tanggal_mulai->equalTo($tanggalKeluarLama)) {
                throw new RuntimeException('Tanggal mulai perpanjangan harus sama dengan tanggal keluar sewa saat ini.');
            }

            $tanggalMulaiPerpanjangan = $tanggalKeluarLama->copy();

            $tanggalKeluarBaru = $this->dateCalculation->calculate(
                $tanggalKeluarLama,
                $extensionDTO->durasi_sewa_bulan
            );

            $sewa = $this->sewaRepository->update($sewa->id_sewa, [
                'tanggal_keluar' => $tanggalKeluarBaru->toDateString(),
                'durasi_sewa_bulan' => ((int) $sewa->durasi_sewa_bulan) + $extensionDTO->durasi_sewa_bulan,
                'harga_deal' => ((float) $sewa->harga_deal) + $extensionDTO->harga_deal,
                'status_sewa' => 'aktif',
            ]);

            $tagihan = $this->tagihanRepository->create([
                'id_sewa' => $sewa->id_sewa,
                'kode_invoice' => $this->generateInvoiceCode($sewa->id_sewa),
                'tanggal_tagihan' => now()->toDateString(),
                'tanggal_jatuh_tempo' => $tanggalMulaiPerpanjangan->toDateString(),
                'total_tagihan' => $extensionDTO->harga_deal,
                'status_tagihan' => 'belum_bayar',
            ]);

            $sewaFresh = $this->sewaRepository->findByIdWithRelations($sewa->id_sewa, ['user', 'kamar']);
            $tanggalKeluarFresh = $this->resolveTanggalKeluar($sewaFresh);

            return [
                'sewa' => SewaDetailDTO::fromModel($sewaFresh, $tanggalKeluarFresh?->toDateString())->toArray(),
                'tagihan' => $tagihan,
            ];
        });
    }

    private function resolveTanggalKeluar(RiwayatSewa $sewa): ?Carbon
    {
        if (! empty($sewa->tanggal_keluar)) {
            return Carbon::parse($sewa->tanggal_keluar)->startOfDay();
        }

        if (empty($sewa->tanggal_masuk) || empty($sewa->durasi_sewa_bulan)) {
            return null;
        }

        return $this->dateCalculation->calculate(
            Carbon::parse($sewa->tanggal_masuk)->startOfDay(),
            (int) $sewa->durasi_sewa_bulan
        );
    }

    private function generateInvoiceCode(int $idSewa): string
    {
        do {
            $code = 'INV-EXT-' . now()->format('Ymd') . '-' . $idSewa . '-' . Str::upper(Str::random(6));
        } while ($this->tagihanRepository->invoiceCodeExists($code));

        return $code;
    }
}
