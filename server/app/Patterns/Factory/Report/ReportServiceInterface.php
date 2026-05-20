<?php

namespace App\Patterns\Factory\Report;

interface ReportServiceInterface
{
    /**
     * Mengambil data atau men-generate format laporan biasa (Array)
     */
    public function generateReport(array $filters = []): array;

    /**
     * Mengekspor data dalam format JSON
     */
    public function exportJson(array $filters = []): string;

    /**
     * Mengekspor data dalam format CSV
     */
    public function exportCsv(array $filters = []): string;
}
