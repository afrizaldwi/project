<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Patterns\Factory\Report\ReportServiceFactory;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    /**
     * $jenis bisa berupa 'keluhan' atau 'tamu'
     */
    public function getLaporan(Request $request, $jenis)
    {
        try {
            $reportService = ReportServiceFactory::create($jenis);
            $format = $request->query('format', 'json');
            $filters = $request->except('format'); 
            
            if ($format === 'csv') {
                $csvData = $reportService->exportCsv($filters);
                
                return response($csvData, 200, [
                    'Content-Type' => 'text/csv',
                    'Content-Disposition' => 'attachment; filename="laporan_' . $jenis . '.csv"',
                ]);
            }
            
            $jsonData = $reportService->exportJson($filters);
            
            return response($jsonData, 200, [
                'Content-Type' => 'application/json',
                'Content-Disposition' => 'attachment; filename="laporan_' . $jenis . '.json"',
            ]);

        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => 'Jenis laporan tidak ditemukan'], 404);
        }
    }
}
