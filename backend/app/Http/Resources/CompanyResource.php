<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'logo_url' => $this->logo_path ? Storage::disk('public')->url($this->logo_path) : null,
            'logo_size' => $this->logo_size,
            'logo_position' => $this->logo_position,
            'primary_color' => $this->primary_color,
            'secondary_color' => $this->secondary_color,
            'signature_url' => $this->signature_path ? Storage::disk('public')->url($this->signature_path) : null,
            'signature_enabled' => $this->signature_enabled,
            'signature_width' => $this->signature_width,
            'signature_x' => $this->signature_x,
            'signature_y' => $this->signature_y,
            'stamp_url' => $this->stamp_path ? Storage::disk('public')->url($this->stamp_path) : null,
            'stamp_enabled' => $this->stamp_enabled,
            'stamp_width' => $this->stamp_width,
            'stamp_rotation' => $this->stamp_rotation,
            'stamp_opacity' => $this->stamp_opacity,
            'stamp_x' => $this->stamp_x,
            'stamp_y' => $this->stamp_y,
            'address' => $this->address,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'tin' => $this->tin,
            'vrn' => $this->vrn,
            'business_registration_number' => $this->business_registration_number,
            'footer_text' => $this->footer_text,
            'terms_conditions' => $this->terms_conditions,
            'payment_instructions' => $this->payment_instructions,
            'default_currency' => new CurrencyResource($this->whenLoaded('defaultCurrency')),
            'default_language' => $this->default_language,
            'invoice_prefix' => $this->invoice_prefix,
            'invoice_number_format' => $this->invoice_number_format,
            'bank_accounts' => $this->whenLoaded('bankAccounts'),
        ];
    }
}
