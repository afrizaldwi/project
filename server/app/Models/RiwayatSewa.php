<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RiwayatSewa extends Model
{
    protected $table = 'riwayat_sewa'; //
    protected $primaryKey = 'id_sewa'; //

    protected $fillable = [
        'id_user',           //
        'id_kamar',          //
        'tanggal_masuk',     //
        'tanggal_keluar',    //
        'harga_deal',        //
        'durasi_sewa_bulan', //
        'status_sewa',       //
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_user'); //
    }

    public function kamar(): BelongsTo
    {
        return $this->belongsTo(Kamar::class, 'id_kamar'); //
    }
}
