<?php

namespace App\Features\Keluhan\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreKeluhanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'penyewa';
    }

    public function rules(): array
    {
        return [
            'judul_keluhan' => ['required', 'string', 'max:150'],
            'deskripsi_keluhan' => ['required', 'string', 'max:2000'],
            'foto_kerusakan' => ['nullable', 'array', 'max:3'],
            'foto_kerusakan.*' => ['image', 'mimes:jpg,jpeg,png', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'judul_keluhan.required' => 'Judul keluhan wajib diisi.',
            'judul_keluhan.max' => 'Judul keluhan maksimal 150 karakter.',
            'deskripsi_keluhan.required' => 'Deskripsi keluhan wajib diisi.',
            'deskripsi_keluhan.max' => 'Deskripsi keluhan maksimal 2000 karakter.',
            'foto_kerusakan.max' => 'Foto kerusakan maksimal 3 file.',
            'foto_kerusakan.*.image' => 'Foto kerusakan harus berupa gambar.',
            'foto_kerusakan.*.mimes' => 'Foto kerusakan harus berformat JPG, JPEG, atau PNG.',
            'foto_kerusakan.*.max' => 'Setiap foto kerusakan maksimal 5MB.',
        ];
    }
}
