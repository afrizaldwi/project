<?php

namespace App\Services;

use App\Features\Sewa\Models\RiwayatSewa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function login(Request $request): array
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return [
                'success' => false,
                'message' => 'Email atau password salah.',
            ];
        }

        if ($this->isInactivePenyewa($user)) {
            return [
                'success' => false,
                'message' => 'Akun penyewa sudah tidak aktif.',
            ];
        }

        return [
            'success' => true,
            'user' => $user,
            'token' => JWTAuth::fromUser($user),
        ];
    }

    public function logout(Request $request): void
    {
        try {
            JWTAuth::parseToken()->invalidate();
        } catch (JWTException) {
            // Logout should be idempotent even when the token was already invalidated.
        }
    }

    public function refresh(Request $request): array
    {
        $user = $request->user('api');
        $token = JWTAuth::parseToken()->refresh();

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function profile(User $user): array
    {
        $profile = [
            'id' => $user->id,
            'nama_lengkap' => $user->nama_lengkap,
            'email' => $user->email,
            'role' => $user->role,
            'no_hp' => $user->no_hp,
            'foto_profil' => $user->foto_profil,
            'alamat_asal' => $user->alamat_asal,
            'created_at' => $user->created_at?->toISOString(),
            'updated_at' => $user->updated_at?->toISOString(),
            'status_sewa' => null,
            'sewa' => null,
            'kamar' => null,
        ];

        if ($user->role !== 'penyewa') {
            return $profile;
        }

        $sewaAktif = RiwayatSewa::query()
            ->with([
                'kamar:id_kamar,nomor_kamar,status_kamar',
            ])
            ->where('id_user', $user->id)
            ->where('status_sewa', 'aktif')
            ->orderByDesc('tanggal_masuk')
            ->orderByDesc('id_sewa')
            ->first();

        if (!$sewaAktif) {
            return $profile;
        }

        $profile['status_sewa'] = $sewaAktif->status_sewa;

        $profile['sewa'] = [
            'tanggal_masuk' => $sewaAktif->tanggal_masuk,
            'tanggal_keluar' => $sewaAktif->tanggal_keluar,
            'status_sewa' => $sewaAktif->status_sewa,
        ];

        $profile['kamar'] = $sewaAktif->kamar
            ? [
                'nomor_kamar' => $sewaAktif->kamar->nomor_kamar,
                'status_kamar' => $sewaAktif->kamar->status_kamar,
            ]
            : null;

        return $profile;
    }

    public function changePassword(
        User $user,
        string $currentPassword,
        string $password,
        string $passwordConfirmation
    ): void {
        if (! Hash::check($currentPassword, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password saat ini tidak sesuai.'],
            ]);
        }

        if (Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Password baru tidak boleh sama dengan password lama.'],
            ]);
        }

        if ($password !== $passwordConfirmation) {
            throw ValidationException::withMessages([
                'password_confirmation' => ['Konfirmasi password tidak sesuai.'],
            ]);
        }

        $user->password = $password;
        $user->save();
    }

    private function isInactivePenyewa(User $user): bool
    {
        return $user->role === 'penyewa'
            && ! $user->riwayatSewa()->where('status_sewa', 'aktif')->exists();
    }
}
