<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        'name',
        'logo_path',
        'logo_size',
        'logo_position',
        'primary_color',
        'secondary_color',
        'signature_path',
        'signature_enabled',
        'signature_width',
        'signature_x',
        'signature_y',
        'stamp_path',
        'stamp_enabled',
        'stamp_width',
        'stamp_rotation',
        'stamp_opacity',
        'stamp_x',
        'stamp_y',
        'qr_code_path',
        'address',
        'phone',
        'email',
        'website',
        'tin',
        'vrn',
        'business_registration_number',
        'footer_text',
        'terms_conditions',
        'payment_instructions',
        'default_currency_id',
        'default_language',
        'invoice_prefix',
        'invoice_number_format',
        'next_invoice_number',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'signature_enabled' => 'boolean',
            'stamp_enabled' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function defaultCurrency(): BelongsTo
    {
        return $this->belongsTo(Currency::class, 'default_currency_id');
    }

    public function bankAccounts(): HasMany
    {
        return $this->hasMany(CompanyBankAccount::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }
}
