<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PenghuniRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'nama_lengkap'      => 'required|string|max:255',
            'no_hp'             => 'required|string|max:20',
            'email'             => 'required|email|unique:users,email',
            'password'          => 'required|string|min:8',
            'alamat_asal'       => 'nullable|string',
            'id_kamar'          => 'required|integer|exists:kamar,id_kamar',
            'tanggal_masuk'     => 'required|date',
            'durasi_sewa_bulan' => 'required|integer|min:1',
            'harga_deal'        => 'required|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'nama_lengkap.required'      => 'Nama lengkap wajib diisi.',
            'no_hp.required'             => 'No. HP wajib diisi.',
            'email.required'             => 'Email wajib diisi.',
            'email.unique'               => 'Email sudah digunakan.',
            'password.required'          => 'Password wajib diisi.',
            'password.min'               => 'Password minimal 8 karakter.',
            'id_kamar.required'          => 'Kamar wajib dipilih.',
            'tanggal_masuk.required'     => 'Tanggal masuk wajib diisi.',
            'durasi_sewa_bulan.required' => 'Durasi sewa wajib diisi.',
            'harga_deal.required'        => 'Harga wajib diisi.',
        ];
    }
}