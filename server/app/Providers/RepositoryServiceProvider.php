<?php

namespace App\Providers;

use App\Repositories\Contracts\KamarRepositoryInterface;
use App\Repositories\Contracts\RiwayatSewaRepositoryInterface;
use App\Repositories\Contracts\TagihanRepositoryInterface;
use App\Repositories\Eloquent\KamarRepository;
use App\Repositories\Eloquent\RiwayatSewaRepository;
use App\Repositories\Eloquent\TagihanRepository;
use App\Services\Strategies\Contracts\DateCalculationStrategy;
use App\Services\Strategies\Implementations\MonthlyRentalCalculation;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Repository bindings
        $this->app->bind(KamarRepositoryInterface::class, KamarRepository::class);
        $this->app->bind(RiwayatSewaRepositoryInterface::class, RiwayatSewaRepository::class);
        $this->app->bind(TagihanRepositoryInterface::class, TagihanRepository::class);

        // Strategy bindings
        $this->app->bind(DateCalculationStrategy::class, MonthlyRentalCalculation::class);
    }

    public function boot(): void
    {
        //
    }
}
