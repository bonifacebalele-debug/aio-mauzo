<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_name' => $this->company_name,
            'contact_person' => $this->contact_person,
            'phone' => $this->phone,
            'email' => $this->email,
            'tin' => $this->tin,
            'vrn' => $this->vrn,
            'physical_address' => $this->physical_address,
            'postal_address' => $this->postal_address,
            'country' => $this->country,
            'city' => $this->city,
            'notes' => $this->notes,
            'is_active' => $this->is_active,
            'invoices_count' => $this->whenCounted('invoices'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
