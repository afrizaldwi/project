<?php

namespace App\Features\Keluhan\Models;
use App\Models\RiwayatSewa;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Keluhan extends Model
{
    protected $table = 'keluhan'; //
    protected $primaryKey = 'id_keluhan'; //

    protected $fillable = [
        'id_sewa',           //
        'judul_keluhan',     //
        'deskripsi_keluhan', //
        'foto_kerusakan',    //
        'status_keluhan',    //
        'tanggal_lapor',     //
        'tanggal_selesai',   //
    ];

    // Relasi untuk melihat keluhan ini dari sewa/kamar mana
    public function riwayatSewa(): BelongsTo
    {
        return $this->belongsTo(RiwayatSewa::class, 'id_sewa', 'id_sewa');
    }
}
