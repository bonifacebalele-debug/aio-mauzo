<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceHistory extends Model
{
    protected $table = 'invoice_history';

    public $timestamps = true;

    const UPDATED_AT = null;

    protected $fillable = [
        'invoice_id',
        'action',
        'old_value',
        'new_value',
        'description',
        'user_id',
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
