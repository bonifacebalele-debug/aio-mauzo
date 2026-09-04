<?php

namespace App\Http\Requests\Invoice;

use Illuminate\Foundation\Http\FormRequest;

class SendInvoiceEmailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('view', $this->route('invoice'));
    }

    public function rules(): array
    {
        return [
            'to_email' => ['required', 'email'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ];
    }
}
