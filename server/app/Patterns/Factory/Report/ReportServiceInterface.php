<?php

namespace App\Patterns\Factory\Report;

interface ReportServiceInterface
{
    public function generateReport(array $filters = []): array;
    public function exportJson(array $filters = []): string;
    public function exportCsv(array $filters = []): string;
}
