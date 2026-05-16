<?php

namespace App\Providers;

use App\Models\Keluhan;
use App\Observers\KeluhanObserver;
use App\Services\AuthService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(AuthService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Mendaftarkan Observer untuk model Keluhan
        Keluhan::observe(KeluhanObserver::class);
    }
}
