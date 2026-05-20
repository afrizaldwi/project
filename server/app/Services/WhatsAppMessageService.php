<?php

namespace App\Services;

use App\Models\Tagihan;
use App\Patterns\Strategy\NotificationContext;
use App\Patterns\Strategy\WhatsAppNotificationStrategy;

class WhatsAppMessageService
{
    private NotificationContext $context;

    public function __construct()
    {
        $this->context = new NotificationContext(new WhatsAppNotificationStrategy());
    }

    public function generate(Tagihan $tagihan): array
    {
        return $this->context->generate($tagihan);
    }
}
