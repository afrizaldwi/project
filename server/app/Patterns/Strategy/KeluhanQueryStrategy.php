<?php

namespace App\Patterns\Strategy;

use Illuminate\Database\Eloquent\Builder;

interface KeluhanQueryStrategy
{
    /**
     * Build the query for fetching Keluhan data.
     *
     * @param int|null $id_user
     * @return Builder
     */
    public function buildQuery(?int $id_user): Builder;
}
