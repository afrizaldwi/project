<?php

namespace App\Patterns\Factory\Report;

use App\Models\Keluhan;

class KeluhanReportService implements ReportServiceInterface
{
    public function generateReport(array $filters = []): array
    {
        // Query model Keluhan
        $query = Keluhan::with('riwayatSewa');

        // Contoh penerapan filter jika ada (misal filter status)
        if (isset($filters['status'])) {
            $query->where('status_keluhan', $filters['status']);
        }

        $data = $query->get();

        return [
            'tipe_laporan' => 'Laporan Data Keluhan',
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
        
        fputcsv($output, ['ID Keluhan', 'ID Sewa', 'Judul Keluhan', 'Status', 'Tanggal Lapor', 'Kamar']);
        

        foreach ($data as $item) {
            fputcsv($output, [
                $item->id_keluhan,
                $item->id_sewa,
                $item->judul_keluhan,
                $item->status_keluhan,
                $item->tanggal_lapor,
                $item->riwayatSewa ? $item->riwayatSewa->id_kamar : '-'
            ]);
        }
        
        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);
        
        return $csv;
    }
}
