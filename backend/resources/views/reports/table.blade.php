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
        tr:nth-child(even) { background: #fafafa; }
        .text-right { text-align: right; }
    </style>
</head>
<body>
    <h1>{{ $title }}</h1>
    <p class="meta">
        AIO Technologies
        @if($from || $to)
            &middot; {{ $from ?? 'Start' }} to {{ $to ?? 'Now' }}
        @endif
        &middot; Generated {{ now()->format('M d, Y H:i') }}
    </p>

    <table>
        <thead>
            <tr>
                @foreach($headings as $heading)
                    <th>{{ $heading }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $row)
                <tr>
                    @foreach($row as $value)
                        <td>{{ $value }}</td>
                    @endforeach
                </tr>
            @empty
                <tr><td colspan="{{ count($headings) }}">No data for the selected period.</td></tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
