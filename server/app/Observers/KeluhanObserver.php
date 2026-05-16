<?php

namespace App\Observers;

use App\Models\Keluhan;
use Illuminate\Support\Facades\Log;

class KeluhanObserver
{

    public function created(Keluhan $keluhan): void
    {
        Log::info("OBSERVER: Laporan kerusakan baru masuk dengan ID: " . $keluhan->id_keluhan);
    }

    public function updated(Keluhan $keluhan): void
    {
        if ($keluhan->isDirty('status_keluhan')) {
            Log::info("OBSERVER: Status keluhan #{$keluhan->id_keluhan} berubah menjadi {$keluhan->status_keluhan}");
        }
    }
}
