<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Helvetica', sans-serif; font-size: 11px; color: #14161f; }
        h1 { font-size: 18px; margin-bottom: 2px; }
        p.meta { color: #6b7280; margin-top: 0; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 6px 8px; border-bottom: 1px solid #e5e7eb; text-align: left; }
        th { background: #f4f5fa; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em; color: #6b7280; }
        .text-right { text-align: right; }
        .summary { margin-top: 16px; width: 260px; margin-left: auto; }
        .summary td { border: none; padding: 3px 8px; }
        .summary .total { font-weight: bold; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <h1>Statement of Account</h1>
    <p class="meta">
        {{ $customer['company_name'] }}
        @if($from || $to)
            &middot; {{ $from ?? 'Start' }} to {{ $to ?? 'Now' }}
        @endif
        &middot; Generated {{ now()->format('M d, Y H:i') }}
    </p>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th class="text-right">Debit</th>
                <th class="text-right">Credit</th>
                <th class="text-right">Balance</th>
            </tr>
        </thead>
        <tbody>
            @forelse($entries as $entry)
                <tr>
                    <td>{{ $entry['date'] }}</td>
                    <td>{{ $entry['description'] }}</td>
                    <td class="text-right">{{ $entry['debit'] > 0 ? number_format($entry['debit'], 2) : '' }}</td>
                    <td class="text-right">{{ $entry['credit'] > 0 ? number_format($entry['credit'], 2) : '' }}</td>
                    <td class="text-right">{{ number_format($entry['balance'], 2) }}</td>
                </tr>
            @empty
                <tr><td colspan="5">No activity for the selected period.</td></tr>
            @endforelse
        </tbody>
    </table>

    <table class="summary">
        <tr><td>Total Invoiced</td><td class="text-right">{{ number_format($summary['total_invoiced'], 2) }}</td></tr>
        <tr><td>Total Paid</td><td class="text-right">{{ number_format($summary['total_paid'], 2) }}</td></tr>
        <tr class="total"><td>Closing Balance</td><td class="text-right">{{ number_format($summary['closing_balance'], 2) }}</td></tr>
    </table>
</body>
</html>
