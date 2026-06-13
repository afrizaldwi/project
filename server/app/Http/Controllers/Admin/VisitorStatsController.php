<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\VisitorStatsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitorStatsController extends Controller
{
    private const ALLOWED_PERIODS = ['7', '30', '90', 'all'];

    public function __construct(
        private VisitorStatsService $visitorStatsService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $period = $request->query('period', '7');

        if (! in_array($period, self::ALLOWED_PERIODS, true)) {
            return response()->json([
                'message' => 'Nilai period tidak valid. Gunakan: 7, 30, 90, atau all.',
                'errors' => [
                    'period' => ['Nilai period tidak valid. Gunakan: 7, 30, 90, atau all.'],
                ],
            ], 422);
        }

        return response()->json($this->visitorStatsService->getStats($period));
    }

    public function daily(Request $request): JsonResponse
    {
        $period = $request->query('period', '7');

        if (! in_array($period, self::ALLOWED_PERIODS, true)) {
            return response()->json([
                'message' => 'Nilai period tidak valid. Gunakan: 7, 30, 90, atau all.',
                'errors' => [
                    'period' => ['Nilai period tidak valid. Gunakan: 7, 30, 90, atau all.'],
                ],
            ], 422);
        }

        return response()->json([
            'daily_visitors' => $this->visitorStatsService->getDailyVisitorsFiltered($period),
        ]);
    }
}
