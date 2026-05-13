<?php
namespace App\Services;

class NotifikasiService
{
    private array $handlers = [];

    public function addHandler(callable $handler): void
    {
        $this->handlers[] = $handler;
    }

    public function kirim(array $payload): void
    {
        foreach ($this->handlers as $handler) {
            $handler($payload);
        }
    }
}