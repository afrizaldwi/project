<?php

namespace App\Patterns\Factory\Report;

use InvalidArgumentException;

class ReportServiceFactory
{
    /**
     * Factory Method untuk membuat tipe Laporan yang diminta Admin
     */
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
