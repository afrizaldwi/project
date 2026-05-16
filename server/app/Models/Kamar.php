<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kamar extends Model
{
    protected $table = 'kamar';
    protected $primaryKey = 'id_kamar';

    protected $fillable = [
        'nomor_kamar',
        'luas_kamar',
        'fasilitas',
        'harga_bulanan',
        'foto_kamar',
        'status_kamar',
    ];

    protected $casts = [
        'harga_bulanan' => 'float',
        'created_at'    => 'datetime',
        'updated_at'    => 'datetime',
    ];
}
