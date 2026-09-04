<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmailLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'to_email' => $this->to_email,
            'subject' => $this->subject,
            'status' => $this->status,
            'provider_response' => $this->provider_response,
            'sent_at' => $this->sent_at,
            'created_at' => $this->created_at,
        ];
    }
}
