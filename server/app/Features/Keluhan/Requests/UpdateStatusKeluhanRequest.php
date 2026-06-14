<?php

namespace App\Features\Keluhan\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStatusKeluhanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'status_keluhan' => [
                'required',
                Rule::in(['pending', 'proses', 'selesai']),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'status_keluhan.required' => 'Status keluhan wajib dipilih.',
            'status_keluhan.in' => 'Status keluhan tidak valid.',
        ];
    }
}
