<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
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

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }

    protected function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    protected function isPenyewa(): bool
    {
        return $this->role === 'penyewa';
    }

    public function riwayatSewa(): HasMany
    {
        return $this->hasMany(RiwayatSewa::class, 'id_user', 'id');
    }
}
