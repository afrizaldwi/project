<?php

namespace App\Providers;

use App\Features\Auth\Services\AuthService;
use App\Features\Penghuni\Services\AdminPenghuniService;
use App\Features\Laporan\Services\LaporanKeuanganService;
use App\Features\VisitorAnalytics\Services\VisitorTrackingService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(AuthService::class);
        $this->app->singleton(VisitorTrackingService::class);
        $this->app->singleton(AdminPenghuniService::class);
        $this->app->singleton(LaporanKeuanganService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
