<?php

namespace App\Enums;

enum InvoiceStatus: string
{
    case Draft = 'draft';
    case Sent = 'sent';
    case Viewed = 'viewed';
    case Paid = 'paid';
    case Cancelled = 'cancelled';
    case Overdue = 'overdue';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Sent => 'Sent',
            self::Viewed => 'Viewed',
            self::Paid => 'Paid',
            self::Cancelled => 'Cancelled',
            self::Overdue => 'Overdue',
        };
    }

    /**
     * Statuses considered "closed" — no further edits or reminders expected.
     */
    public function isFinal(): bool
    {
        return in_array($this, [self::Paid, self::Cancelled], true);
    }
}
