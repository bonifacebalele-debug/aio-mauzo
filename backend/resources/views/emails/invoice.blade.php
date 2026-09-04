<x-mail::message>
# Invoice {{ $invoice->invoice_number }}

Hello {{ $invoice->customer->contact_person ?: $invoice->customer->company_name }},

{{ $customMessage }}

<x-mail::table>
| | |
|:---|---:|
| **Invoice Number** | {{ $invoice->invoice_number }} |
| **Invoice Date** | {{ $invoice->invoice_date->format('M d, Y') }} |
@if($invoice->due_date)
| **Due Date** | {{ $invoice->due_date->format('M d, Y') }} |
@endif
| **Amount Due** | {{ $invoice->currency->symbol }} {{ number_format($invoice->outstandingBalance(), 2) }} |
</x-mail::table>

@if($invoice->pdf_path)
The invoice PDF is attached to this email.
@endif

Thank you for your business.

{{ $company->footer_text ?? 'Regards,' }}<br>
{{ $company->name }}
</x-mail::message>
