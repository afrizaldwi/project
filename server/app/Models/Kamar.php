<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
