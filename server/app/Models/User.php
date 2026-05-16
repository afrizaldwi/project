<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'email',
        'password',
        'role',
        'nama_lengkap',
        'no_hp',
        'foto_profil',
        'alamat_asal',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function riwayatSewa()
    {
        return $this->hasMany(RiwayatSewa::class, 'id_user');
    }

    protected function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    protected function isPeyewa(): bool
    {
        return $this->role === 'penyewa';
    }
}
