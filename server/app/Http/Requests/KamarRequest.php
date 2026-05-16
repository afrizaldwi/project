<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KamarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH') || ($this->isMethod('POST') && $this->route('id'));

        return [
            'nomor_kamar'   => $isUpdate ? 'sometimes|required|string|max:10' : 'required|string|max:10|unique:kamar,nomor_kamar',
            'luas_kamar'    => 'required|string|max:50',
            'fasilitas'     => 'required|string',
            'harga_bulanan' => 'required|numeric|min:0',
            'status_kamar'  => 'required|in:tersedia,terisi',
            'foto_kamar'    => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'nomor_kamar.required'   => 'Nomor kamar wajib diisi.',
            'nomor_kamar.unique'     => 'Nomor kamar sudah digunakan.',
            'luas_kamar.required'    => 'Ukuran kamar wajib diisi.',
            'fasilitas.required'     => 'Fasilitas kamar wajib diisi.',
            'harga_bulanan.required' => 'Harga kamar wajib diisi.',
            'status_kamar.required'  => 'Status kamar wajib diisi.',
            'status_kamar.in'        => 'Status kamar harus tersedia atau terisi.',
            'foto_kamar.image'       => 'Foto kamar harus berupa gambar.',
            'foto_kamar.max'         => 'Foto kamar maksimal 2MB.',
        ];
    }
}