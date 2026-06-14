<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Features\Tagihan\Models\Pembayaran;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tagihan extends Model
{
    protected $table = 'tagihan'; //
    protected $primaryKey = 'id_tagihan'; //

    protected $fillable = [
        'id_sewa',             //
        'kode_invoice',        //
        'tanggal_tagihan',     //
        'tanggal_jatuh_tempo', //
        'total_tagihan',       //
        'status_tagihan',      //
    ];

    public function riwayatSewa(): BelongsTo
    {
        return $this->belongsTo(RiwayatSewa::class, 'id_sewa', 'id_sewa');
    }

    public function pembayaran(): HasMany
    {
        return $this->hasMany(Pembayaran::class, 'id_tagihan', 'id_tagihan');
    }
}
