<?php

namespace App\Features\Dashboard\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Features\Dashboard\Services\AdminDashboardService;

class DashboardController extends Controller
{
    protected AdminDashboardService $adminDashboardService;

    public function __construct(AdminDashboardService $adminDashboardService)
    {
        $this->adminDashboardService = $adminDashboardService;
    }

    public function summary()
    {
        $summary = $this->adminDashboardService->getSummary();

        return response()->json($summary);
    }
}