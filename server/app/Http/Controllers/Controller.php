<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

abstract class Controller
{
    protected function validatePagination(Request $request, array $rules = [], array $messages = []): array
    {
        return $request->validate([
            "page" => ["nullable", "integer", "min:1"],
            "per_page" => ["nullable", "integer", "min:1", "max:50"],
            ...$rules,
        ], $messages);
    }

    protected function perPage(Request $request): int
    {
        return min(50, max(1, $request->integer('per_page', 10)));
    }

    protected function paginatedData(LengthAwarePaginator $paginator): array
    {
        return $paginator->getCollection()->values()->all();
    }

    protected function paginationMeta(LengthAwarePaginator $paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'last_page' => $paginator->lastPage(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
        ];
    }
}
