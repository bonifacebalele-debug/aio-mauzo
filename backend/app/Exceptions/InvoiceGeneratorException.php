<?php

namespace App\Exceptions;

use Exception;

class InvoiceGeneratorException extends Exception
{
    public static function missingApiKey(): self
    {
        return new self('Invoice-Generator.com API key is not configured. Set INVOICE_GENERATOR_API_KEY in your .env file.');
    }

    public static function requestFailed(string $reason): self
    {
        return new self("Invoice-Generator.com request failed: {$reason}");
    }
}
