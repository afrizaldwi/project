<?php

namespace App\Features\Notifications\Services;

use App\Models\Tagihan;
use App\Features\Notifications\Patterns\Strategy\NotificationContext;
use App\Features\Notifications\Patterns\Strategy\WhatsAppNotificationStrategy;

class WhatsAppMessageService
{
    private NotificationContext $context;

    public function __construct()
    {
        $this->context = new NotificationContext(new WhatsAppNotificationStrategy());
    }

    public function generate(Tagihan $tagihan): array
    {
        if (in_array($tagihan->status_tagihan, ['lunas', 'dibatalkan'], true)) {
            return [
                'enabled' => false,
                'message' => null,
                'url' => null,
                'reason' => 'Tagihan sudah lunas atau dibatalkan.',
            ];
        }

        return $this->context->generate($tagihan);
    }
}
