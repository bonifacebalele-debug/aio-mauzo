<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanySettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('settings.edit');
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'tin' => ['nullable', 'string', 'max:50'],
            'vrn' => ['nullable', 'string', 'max:50'],
            'business_registration_number' => ['nullable', 'string', 'max:50'],
            'footer_text' => ['nullable', 'string'],
            'terms_conditions' => ['nullable', 'string'],
            'payment_instructions' => ['nullable', 'string'],
            'default_currency_id' => ['nullable', 'integer', 'exists:currencies,id'],
            'default_language' => ['nullable', 'string', 'max:5'],
            'invoice_prefix' => ['nullable', 'string', 'max:20'],
            'invoice_number_format' => ['nullable', 'string', 'max:50'],
            'primary_color' => ['nullable', 'string', 'max:7'],
            'secondary_color' => ['nullable', 'string', 'max:7'],

            'logo_size' => ['nullable', 'in:small,medium,large'],
            'logo_position' => ['nullable', 'in:left,center,right'],

            'signature_enabled' => ['sometimes', 'boolean'],
            'signature_width' => ['nullable', 'integer', 'min:40', 'max:400'],
            'signature_x' => ['nullable', 'integer', 'min:0', 'max:1000'],
            'signature_y' => ['nullable', 'integer', 'min:0', 'max:1000'],

            'stamp_enabled' => ['sometimes', 'boolean'],
            'stamp_width' => ['nullable', 'integer', 'min:40', 'max:400'],
            'stamp_rotation' => ['nullable', 'integer', 'min:-180', 'max:180'],
            'stamp_opacity' => ['nullable', 'integer', 'min:10', 'max:100'],
            'stamp_x' => ['nullable', 'integer', 'min:0', 'max:1000'],
            'stamp_y' => ['nullable', 'integer', 'min:0', 'max:1000'],
        ];
    }
}
