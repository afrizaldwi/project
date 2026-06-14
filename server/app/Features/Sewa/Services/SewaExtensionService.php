<?php

namespace App\Features\Sewa\Services;

use App\Features\Sewa\Contracts\DateCalculationStrategy;
use App\Features\Sewa\Contracts\RiwayatSewaRepositoryInterface;
use App\Features\Sewa\DTOs\SewaDetailDTO;
use App\Features\Sewa\DTOs\SewaExtensionDTO;
use App\Features\Sewa\Models\RiwayatSewa;
use App\Repositories\Contracts\TagihanRepositoryInterface;
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

            $extensionAmount = $this->calculateExtensionAmount(
                $sewa,
                $extensionDTO->durasi_sewa_bulan
            );

            $sewa = $this->sewaRepository->update($sewa->id_sewa, [
                'tanggal_keluar' => $tanggalKeluarBaru->toDateString(),
                'durasi_sewa_bulan' => ((int) $sewa->durasi_sewa_bulan)
                    + $extensionDTO->durasi_sewa_bulan,
                'harga_deal' => round(
                    ((float) $sewa->harga_deal) + $extensionAmount,
                    2
                ),
                'status_sewa' => 'aktif',
            ]);

            $tagihan = $this->tagihanRepository->create([
                'id_sewa' => $sewa->id_sewa,
                'kode_invoice' => $this->generateInvoiceCode($sewa->id_sewa),
                'tanggal_tagihan' => now()->toDateString(),
                'tanggal_jatuh_tempo' => $tanggalMulaiPerpanjangan->toDateString(),
                'total_tagihan' => $extensionAmount,
                'status_tagihan' => 'belum_bayar',
            ]);

            $sewaFresh = $this->sewaRepository->findByIdWithRelations(
                $sewa->id_sewa,
                ['user', 'kamar']
            );

            $tanggalKeluarFresh = $this->resolveTanggalKeluar($sewaFresh);

            return [
                'sewa' => SewaDetailDTO::fromModel(
                    $sewaFresh,
                    $tanggalKeluarFresh?->toDateString()
                )->toArray(),
                'tagihan' => $tagihan,
            ];
        });
    }

    private function calculateExtensionAmount(
        RiwayatSewa $sewa,
        int $durationMonths
    ): float {
        return round(
            ((float) $sewa->kamar->harga_bulanan) * $durationMonths,
            2
        );
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
            $code = 'INV-EXT-' . now()->format('Ymd') . '-' . $idSewa . '-'
                . Str::upper(Str::random(6));
        } while ($this->tagihanRepository->invoiceCodeExists($code));

        return $code;
    }
}
