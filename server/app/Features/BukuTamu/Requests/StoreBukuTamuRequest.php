<?php

namespace App\Features\BukuTamu\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBukuTamuRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user = $this->user();
        $rules = [
            'nama_tamu' => ['required', 'string', 'max:100'],
            'no_hp_tamu' => ['required', 'string', 'max:20'],
            'keperluan' => ['required', 'string', 'max:1000'],
        ];

        if ($user?->role === 'admin') {
            $rules['id_user'] = [
                'required',
                Rule::exists('users', 'id')->where('role', 'penyewa'),
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'nama_tamu.required' => 'Nama tamu wajib diisi.',
            'nama_tamu.max' => 'Nama tamu maksimal 100 karakter.',
            'no_hp_tamu.required' => 'Nomor HP tamu wajib diisi.',
            'no_hp_tamu.max' => 'Nomor HP tamu maksimal 20 karakter.',
            'keperluan.required' => 'Keperluan wajib diisi.',
            'keperluan.max' => 'Keperluan maksimal 1000 karakter.',
            'id_user.required' => 'Penghuni yang dikunjungi wajib dipilih.',
            'id_user.exists' => 'Penghuni yang dipilih tidak valid.',
        ];
    }
}
