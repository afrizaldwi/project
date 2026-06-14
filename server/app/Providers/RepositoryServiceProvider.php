<?php

namespace App\Providers;

use App\Features\BukuTamu\Contracts\BukuTamuRepositoryInterface;
use App\Features\BukuTamu\Repositories\BukuTamuRepository;
use App\Features\Keluhan\Contracts\KeluhanRepositoryInterface;
use App\Features\Keluhan\Repositories\KeluhanRepository;
use App\Features\Kamar\Contracts\KamarRepositoryInterface;
use App\Features\Kamar\Repositories\KamarRepository;
use App\Features\Sewa\Contracts\DateCalculationStrategy;
use App\Features\Sewa\Contracts\RiwayatSewaRepositoryInterface;
use App\Features\Sewa\Repositories\RiwayatSewaRepository;
use App\Features\Sewa\Services\MonthlyRentalCalculation;
use App\Repositories\Contracts\TagihanRepositoryInterface;
use App\Repositories\Eloquent\TagihanRepository;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Repository bindings
        $this->app->bind(KamarRepositoryInterface::class, KamarRepository::class);
        $this->app->bind(RiwayatSewaRepositoryInterface::class, RiwayatSewaRepository::class);
        $this->app->bind(TagihanRepositoryInterface::class, TagihanRepository::class);

        $this->app->bind(BukuTamuRepositoryInterface::class, BukuTamuRepository::class);
        $this->app->bind(KeluhanRepositoryInterface::class, KeluhanRepository::class);

        // Strategy bindings
        $this->app->bind(DateCalculationStrategy::class, MonthlyRentalCalculation::class);
    }

    public function boot(): void
    {
        //
    }
}
