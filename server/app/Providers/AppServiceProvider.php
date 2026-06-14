<?php

namespace App\Providers;

use App\Features\Auth\Services\AuthService;
use App\Features\Penghuni\Services\AdminPenghuniService;
use App\Features\Laporan\Services\LaporanKeuanganService;
use App\Features\InvoiceTransaksi\Services\InvoiceService;
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
        $this->app->singleton(InvoiceService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                \App\Features\Notifications\Commands\CheckTagihanJatuhTempo::class,
            ]);
        }
        $this->loadViewsFrom(app_path('Features/InvoiceTransaksi/Views'), 'invoice-transaksi');
    }
}
