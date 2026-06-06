<?php

namespace App\Services;

use Symfony\Component\HttpFoundation\Response;

class VisitorExportService
{
    public function __construct(
        private VisitorStatsService $visitorStatsService
    ) {}

    public function exportCsv(): Response
    {
        $stream = fopen('php://temp', 'r+');

        fputcsv($stream, [
            'date',
            'country',
            'city',
            'unique_visitors',
        ]);

        foreach ($this->visitorStatsService->getExportRows() as $row) {
            fputcsv($stream, [
                $row['date'],
                $row['country'],
                $row['city'],
                $row['unique_visitors'],
            ]);
        }

        rewind($stream);
        $csv = stream_get_contents($stream);
        fclose($stream);

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="visitor-statistics.csv"',
        ]);
    }
}
