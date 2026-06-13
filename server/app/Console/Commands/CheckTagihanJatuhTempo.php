<?php

namespace App\Console\Commands;

use App\Services\TagihanReminderService;
use Illuminate\Console\Command;

class CheckTagihanJatuhTempo extends Command
{
    protected $signature = 'tagihan:check-jatuh-tempo';

    protected $description = 'Mengecek tagihan H-7 / terlambat dan membuat notifikasi otomatis.';

    public function handle(TagihanReminderService $tagihanReminderService): int
    {
        $createdCount = $tagihanReminderService->checkAndCreateNotifications();

        $this->info("Pengecekan selesai. Notifikasi baru: {$createdCount}");

        return self::SUCCESS;
    }
}
