<?php

namespace App\Features\Tagihan\Models;

use App\Models\Tagihan;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pembayaran extends Model
{
    protected $table = 'pembayaran'; //
    protected $primaryKey = 'id_pembayaran'; //

    protected $fillable = [
        'id_tagihan',         //
        'tanggal_bayar',      //
        'jumlah_bayar',       //
        'metode_pembayaran',  //
        'bukti_bayar',        //
        'status_verifikasi',  //
        'catatan_admin',      //
    ];

    // Relasi kembali ke Tagihan
    public function tagihan(): BelongsTo
    {
        return $this->belongsTo(Tagihan::class, 'id_tagihan', 'id_tagihan');
    }
}
