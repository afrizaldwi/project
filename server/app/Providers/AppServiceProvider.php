<?php

namespace App\Providers;

use App\Services\Admin\AdminPenghuniService;
use App\Features\LaporanKeuangan\Services\LaporanKeuanganService;
use App\Services\AuthService;
use App\Services\VisitorTrackingService;
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
        $this->loadViewsFrom(app_path('Features/InvoiceTransaksi/Views'), 'invoice-transaksi');
    }
}
