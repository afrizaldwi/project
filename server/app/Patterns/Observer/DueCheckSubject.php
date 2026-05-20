<?php

namespace App\Patterns\Observer;

use App\Models\Tagihan;

class DueCheckSubject
{
    /** @var NotificationObserverInterface[] */
    private array $observers = [];

    public function attach(NotificationObserverInterface $observer): void
    {
        $this->observers[] = $observer;
    }

    public function detach(NotificationObserverInterface $observer): void
    {
        $this->observers = array_filter(
            $this->observers,
            fn($obs) => $obs !== $observer
        );
    }

    public function notify(Tagihan $tagihan, array $warning): void
    {
        foreach ($this->observers as $observer) {
            $observer->update($tagihan, $warning);
        }
    }
}
