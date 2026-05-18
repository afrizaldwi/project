<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PerpanjangRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tanggal_mulai' => ['required', 'date'],
            'durasi_sewa_bulan' => ['required', 'integer', 'min:1', 'max:24'],
            'harga_deal' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'tanggal_mulai.required' => 'Tanggal mulai perpanjangan wajib diisi.',
            'tanggal_mulai.date' => 'Tanggal mulai perpanjangan tidak valid.',
            'durasi_sewa_bulan.required' => 'Durasi perpanjangan wajib diisi.',
            'durasi_sewa_bulan.integer' => 'Durasi perpanjangan harus berupa angka.',
            'durasi_sewa_bulan.min' => 'Durasi minimal 1 bulan.',
            'durasi_sewa_bulan.max' => 'Durasi maksimal 24 bulan.',
            'harga_deal.required' => 'Harga deal wajib diisi.',
            'harga_deal.numeric' => 'Harga deal harus berupa angka.',
            'harga_deal.min' => 'Harga deal tidak boleh kurang dari 0.',
        ];
    }
}
