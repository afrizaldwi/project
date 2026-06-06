<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\VisitorStatsService;
use Illuminate\Http\JsonResponse;

class VisitorStatsController extends Controller
{
    public function __construct(
        private VisitorStatsService $visitorStatsService
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->visitorStatsService->getStats());
    }
}
