<?php

namespace App\Features\BukuTamu\Services;

use App\Features\BukuTamu\Models\BukuTamu;
use App\Patterns\Factory\Report\ReportServiceInterface;

class TamuReportService implements ReportServiceInterface
{
    public function generateReport(array $filters = []): array
    {
        $query = BukuTamu::with('dikunjungi');

        if (isset($filters['tanggal'])) {
            $query->whereDate('waktu_berkunjung', $filters['tanggal']);
        }

        $data = $query->get();

        return [
            'tipe_laporan' => 'Laporan Data Buku Tamu',
            'total_data' => $data->count(),
            'data' => $data
        ];
    }

    public function exportJson(array $filters = []): string
    {
        $report = $this->generateReport($filters);
        return json_encode($report, JSON_PRETTY_PRINT);
    }

    public function exportCsv(array $filters = []): string
    {
        $data = $this->generateReport($filters)['data'];
        
        $output = fopen('php://temp', 'w');
        
        fputcsv($output, ['ID Tamu', 'Nama Tamu', 'No HP', 'Bertemu Dengan', 'Keperluan', 'Waktu Berkunjung']);
        
        foreach ($data as $item) {
            fputcsv($output, [
                $item->id_tamu,
                $item->nama_tamu,
                $item->no_hp_tamu,
                $item->dikunjungi ? $item->dikunjungi->name : $item->bertemu_dengan,
                $item->keperluan,
                $item->waktu_berkunjung
            ]);
        }
        
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        
        return $csv;
    }
}
