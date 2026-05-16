<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kamar extends Model
{
    protected $table = 'kamar'; //
    protected $primaryKey = 'id_kamar'; //

    protected $fillable = [
        'nomor_kamar',   //
        'fasilitas',     //
        'harga_bulanan', //
        'luas_kamar',    //
        'foto_kamar',    //
        'status_kamar',  //
    ];

    public function riwayatSewa(): HasMany
    {
        return $this->hasMany(RiwayatSewa::class, 'id_kamar', 'id_kamar');
    }
}
