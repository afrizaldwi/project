<?php

namespace App\Http\Controllers\Penyewa;

use App\Http\Controllers\Controller;
use App\Services\Dashboard\PenyewaDashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected PenyewaDashboardService $penyewaDashboardService;

    public function __construct(PenyewaDashboardService $penyewaDashboardService)
    {
        $this->penyewaDashboardService = $penyewaDashboardService;
    }

    public function summary(Request $request)
    {
        $summary = $this->penyewaDashboardService->getSummary($request->user()->id);

        return response()->json($summary);
    }
}