<?php

namespace App\Http\Requests\Invoice;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInvoiceStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('updateStatus', $this->route('invoice'));
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:sent,viewed,paid,cancelled'],
        ];
    }
}
