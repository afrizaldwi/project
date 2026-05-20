<?php

namespace App\Services;

use App\Models\MobileDeviceToken;
use App\Models\Notifikasi;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FcmPushNotificationService
{
    public function sendToUser(int $userId, Notifikasi $notifikasi): void
    {
        $tokens = MobileDeviceToken::where('id_user', $userId)->get();

        foreach ($tokens as $token) {
            $this->sendToToken($token->device_token, $notifikasi);
        }
    }

    private function sendToToken(string $deviceToken, Notifikasi $notifikasi): bool
    {
        $projectId = config('services.fcm.project_id');

        if (! $projectId || ! config('services.fcm.client_email') || ! config('services.fcm.private_key')) {
            Log::info('FCM skipped because configuration is incomplete.', [
                'notifikasi_id' => $notifikasi->id,
            ]);

            return false;
        }

        $accessToken = $this->getAccessToken();

        if (! $accessToken) {
            return false;
        }

        $response = Http::withToken($accessToken)
            ->post("https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send", [
                'message' => [
                    'token' => $deviceToken,
                    'notification' => [
                        'title' => $notifikasi->judul,
                        'body' => $notifikasi->pesan,
                    ],
                    'data' => [
                        'notifikasi_id' => (string) $notifikasi->id,
                        'id_tagihan' => (string) $notifikasi->id_tagihan,
                        'tipe' => $notifikasi->tipe,
                    ],
                    'android' => [
                        'priority' => 'HIGH',
                    ],
                ],
            ]);

        if ($response->failed()) {
            Log::warning('FCM push notification failed.', [
                'notifikasi_id' => $notifikasi->id,
                'response' => $response->json(),
            ]);

            return false;
        }

        $notifikasi->pushed_at = now();
        $notifikasi->save();

        return true;
    }

    private function getAccessToken(): ?string
    {
        return Cache::remember('fcm_access_token', now()->addMinutes(50), function () {
            $clientEmail = config('services.fcm.client_email');
            $privateKey = config('services.fcm.private_key');

            if (! $clientEmail || ! $privateKey) {
                return null;
            }

            $now = time();

            $header = [
                'alg' => 'RS256',
                'typ' => 'JWT',
            ];

            $claim = [
                'iss' => $clientEmail,
                'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
                'aud' => 'https://oauth2.googleapis.com/token',
                'iat' => $now,
                'exp' => $now + 3600,
            ];

            $jwtHeader = $this->base64UrlEncode(json_encode($header));
            $jwtClaim = $this->base64UrlEncode(json_encode($claim));

            $unsignedJwt = $jwtHeader . '.' . $jwtClaim;

            $signature = '';

            openssl_sign(
                $unsignedJwt,
                $signature,
                str_replace('\\n', "\n", $privateKey),
                'sha256WithRSAEncryption'
            );

            $jwt = $unsignedJwt . '.' . $this->base64UrlEncode($signature);

            $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion' => $jwt,
            ]);

            if ($response->failed()) {
                Log::warning('Failed to get FCM access token.', [
                    'response' => $response->json(),
                ]);

                return null;
            }

            return $response->json('access_token');
        });
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }
}
