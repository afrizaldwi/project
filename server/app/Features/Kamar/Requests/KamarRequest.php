<?php

namespace App\Features\Kamar\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class KamarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $kamarParam = $this->route('id') ?? $this->route('kamar');
        $kamarId = is_object($kamarParam) && method_exists($kamarParam, 'getKey')
            ? $kamarParam->getKey()
            : $kamarParam;

        $isCreate = $this->isMethod('post') && empty($kamarId);

        $uniqueNomorKamar = Rule::unique('kamar', 'nomor_kamar');

        if (! empty($kamarId)) {
            $uniqueNomorKamar->ignore($kamarId, 'id_kamar');
        }

        return [
            'nomor_kamar' => [
                $isCreate ? 'required' : 'sometimes',
                'string',
                'max:10',
                $uniqueNomorKamar,
            ],
            'luas_kamar' => [
                $isCreate ? 'required' : 'sometimes',
                'string',
                'max:50',
            ],
            'fasilitas' => [
                $isCreate ? 'required' : 'sometimes',
                'string',
            ],
            'harga_bulanan' => [
                $isCreate ? 'required' : 'sometimes',
                'numeric',
                'min:0',
            ],
            'status_kamar' => [
                $isCreate ? 'required' : 'sometimes',
                Rule::in(['tersedia', 'terisi', 'perbaikan']),
            ],
            'foto_kamar' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png',
                'max:2048',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nomor_kamar.required' => 'Nomor kamar wajib diisi.',
            'nomor_kamar.unique' => 'Nomor kamar sudah digunakan.',
            'luas_kamar.required' => 'Ukuran kamar wajib diisi.',
            'fasilitas.required' => 'Fasilitas kamar wajib diisi.',
            'harga_bulanan.required' => 'Harga kamar wajib diisi.',
            'harga_bulanan.numeric' => 'Harga kamar harus berupa angka.',
            'harga_bulanan.min' => 'Harga kamar tidak boleh kurang dari 0.',
            'status_kamar.required' => 'Status kamar wajib diisi.',
            'status_kamar.in' => 'Status kamar harus tersedia, terisi, atau perbaikan.',
            'foto_kamar.image' => 'Foto kamar harus berupa gambar.',
            'foto_kamar.mimes' => 'Foto kamar harus berformat JPG, JPEG, atau PNG.',
            'foto_kamar.max' => 'Foto kamar maksimal 2MB.',
        ];
    }
}
