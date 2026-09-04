<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'reference' => $this->reference,
            'invoice_date' => $this->invoice_date?->toDateString(),
            'due_date' => $this->due_date?->toDateString(),
            'status' => $this->status,
            'status_label' => $this->status->label(),
            'subtotal' => (float) $this->subtotal,
            'discount_total' => (float) $this->discount_total,
            'tax_total' => (float) $this->tax_total,
            'grand_total' => (float) $this->grand_total,
            'amount_paid' => (float) $this->amount_paid,
            'outstanding_balance' => (float) $this->outstandingBalance(),
            'notes' => $this->notes,
            'terms' => $this->terms,
            'pdf_url' => $this->pdf_path ? Storage::disk('public')->url($this->pdf_path) : null,
            'pdf_generated_at' => $this->pdf_generated_at,
            'sent_at' => $this->sent_at,
            'viewed_at' => $this->viewed_at,
            'paid_at' => $this->paid_at,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'currency' => new CurrencyResource($this->whenLoaded('currency')),
            'items' => InvoiceItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
