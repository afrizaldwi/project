<?php

namespace App\Features\BukuTamu\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\User;

class BukuTamu extends Model
{
    protected $table = 'buku_tamu'; //
    protected $primaryKey = 'id_tamu'; //

    protected $fillable = [
        'nama_tamu',        //
        'no_hp_tamu',       //
        'bertemu_dengan',   //
        'keperluan',        //
        'waktu_berkunjung', //
    ];

    // Relasi untuk melihat penghuni (user) mana yang dikunjungi
    public function dikunjungi(): BelongsTo
    {
        return $this->belongsTo(User::class, 'bertemu_dengan');
    }
}
