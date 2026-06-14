<?php

namespace App\Features\Notifications\Models;

use App\Models\User;
use App\Models\Tagihan;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notifikasi extends Model
{
    protected $table = 'notifikasis';

    protected $fillable = [
        'id_user',
        'id_tagihan',
        'role_target',
        'tipe',
        'judul',
        'pesan',
        'is_read',
        'read_at',
        'pushed_at',
        'last_reminded_at',
        'reminder_count',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'pushed_at' => 'datetime',
        'last_reminded_at' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }

    public function tagihan(): BelongsTo
    {
        return $this->belongsTo(Tagihan::class, 'id_tagihan', 'id_tagihan');
    }
}
