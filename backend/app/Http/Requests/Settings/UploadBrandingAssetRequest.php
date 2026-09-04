<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UploadBrandingAssetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('settings.edit');
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'mimes:png,jpg,jpeg,svg,webp', 'max:4096'],
        ];
    }
}
