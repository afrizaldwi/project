<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pengeluaran extends Model
{
    protected $table = 'pengeluaran'; //
    protected $primaryKey = 'id_pengeluaran'; //

    protected $fillable = [
        'judul_pengeluaran',   //
        'deskripsi',           //
        'jumlah_pengeluaran',  //
        'tanggal_pengeluaran', //
        'bukti_foto',          //
        'dibuat_oleh',         //
    ];

    // Relasi untuk melihat Admin mana yang mencatat pengeluaran ini
    public function pencatat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }
}
