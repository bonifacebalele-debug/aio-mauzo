<?php

namespace App\Models;

use App\Enums\InvoiceStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'company_id',
        'customer_id',
        'invoice_template_id',
        'currency_id',
        'invoice_number',
        'reference',
        'invoice_date',
        'due_date',
        'status',
        'subtotal',
        'discount_total',
        'tax_total',
        'grand_total',
        'amount_paid',
        'notes',
        'terms',
        'prepared_by',
        'approved_by',
        'created_by',
        'duplicated_from',
        'pdf_path',
        'pdf_generated_at',
        'sent_at',
        'viewed_at',
        'paid_at',
        'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => InvoiceStatus::class,
            'invoice_date' => 'date',
            'due_date' => 'date',
            'subtotal' => 'decimal:2',
            'discount_total' => 'decimal:2',
            'tax_total' => 'decimal:2',
            'grand_total' => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'pdf_generated_at' => 'datetime',
            'sent_at' => 'datetime',
            'viewed_at' => 'datetime',
            'paid_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function customer(): BelongsTo
    {
        // withTrashed: a soft-deleted customer must not disappear from invoices
        // that already reference them — historical records need to keep showing
        // who they were billed to. Only the active customer list/combobox (a
        // separate query, unaffected by this relationship) excludes them.
        return $this->belongsTo(Customer::class)->withTrashed();
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(InvoiceTemplate::class, 'invoice_template_id');
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class)->orderBy('sort_order');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function history(): HasMany
    {
        return $this->hasMany(InvoiceHistory::class)->latest();
    }

    public function emailLogs(): HasMany
    {
        return $this->hasMany(EmailLog::class);
    }

    public function preparedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prepared_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function duplicatedFrom(): BelongsTo
    {
        return $this->belongsTo(Invoice::class, 'duplicated_from');
    }

    public function outstandingBalance(): string
    {
        return bcsub((string) $this->grand_total, (string) $this->amount_paid, 2);
    }
}
