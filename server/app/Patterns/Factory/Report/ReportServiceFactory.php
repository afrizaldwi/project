<?php

namespace App\Patterns\Factory\Report;

use App\Features\BukuTamu\Services\TamuReportService;
use App\Features\Keluhan\Services\KeluhanReportService;
use InvalidArgumentException;

class ReportServiceFactory
{
    public static function create(string $type): ReportServiceInterface
    {
        switch (strtolower($type)) {
            case 'keluhan':
                return new KeluhanReportService();
            case 'tamu':
                return new TamuReportService();
            default:
                throw new InvalidArgumentException("Tipe laporan '{$type}' tidak didukung.");
        }
    }
}
