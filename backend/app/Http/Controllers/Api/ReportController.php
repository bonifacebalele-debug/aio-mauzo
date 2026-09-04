<?php

namespace App\Http\Controllers\Api;

use App\Exports\ReportExport;
use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Excel as ExcelFormat;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Response;

class ReportController extends Controller
{
    private const array REPORTS = [
        'sales' => [
            'title' => 'Sales Report',
            'headings' => ['Invoice #', 'Date', 'Customer', 'Status', 'Subtotal', 'Discount', 'Tax', 'Grand Total'],
        ],
        'vat' => [
            'title' => 'VAT Report',
            'headings' => ['Invoice #', 'Date', 'Customer', 'Description', 'Taxable Amount', 'Tax Rate %', 'Tax Amount'],
        ],
        'customers' => [
            'title' => 'Customer Report',
            'headings' => ['Customer', 'Invoices', 'Total Invoiced', 'Total Paid', 'Outstanding'],
        ],
        'outstanding' => [
            'title' => 'Outstanding Report',
            'headings' => ['Invoice #', 'Customer', 'Invoice Date', 'Due Date', 'Status', 'Grand Total', 'Paid', 'Outstanding', 'Days Overdue'],
        ],
        'payments' => [
            'title' => 'Payment Report',
            'headings' => ['Date', 'Invoice #', 'Customer', 'Amount', 'Method', 'Reference'],
        ],
    ];

    public function __construct(private readonly ReportService $reports) {}

    public function show(Request $request, string $type): JsonResponse
    {
        Gate::authorize('reports.view');
        $this->assertValidType($type);

        $rows = $this->buildRows($type, $request);

        return response()->json([
            'data' => $rows->values(),
            'meta' => [
                'title' => self::REPORTS[$type]['title'],
                'headings' => self::REPORTS[$type]['headings'],
                'count' => $rows->count(),
            ],
        ]);
    }

    public function periodSummary(Request $request): JsonResponse
    {
        Gate::authorize('reports.view');

        $period = $request->input('period', 'monthly') === 'yearly' ? 'yearly' : 'monthly';
        $year = (int) $request->input('year', now()->year);

        return response()->json(['data' => $this->reports->periodSummary($period, $year)]);
    }

    public function export(Request $request, string $type): Response
    {
        Gate::authorize('reports.view');
        $this->assertValidType($type);

        $format = $request->input('format', 'csv');
        $rows = $this->buildRows($type, $request);
        $meta = self::REPORTS[$type];
        $filename = Str::slug($meta['title']).'-'.now()->format('Y-m-d');

        return match ($format) {
            'pdf' => Pdf::loadView('reports.table', [
                'title' => $meta['title'],
                'headings' => $meta['headings'],
                'rows' => $rows,
                'from' => $request->input('from'),
                'to' => $request->input('to'),
            ])->download("{$filename}.pdf"),
            'xlsx' => Excel::download(new ReportExport($rows, $meta['headings']), "{$filename}.xlsx"),
            default => Excel::download(new ReportExport($rows, $meta['headings']), "{$filename}.csv", ExcelFormat::CSV),
        };
    }

    private function buildRows(string $type, Request $request): Collection
    {
        $from = $request->input('from');
        $to = $request->input('to');

        return match ($type) {
            'sales' => $this->reports->salesReport($from, $to),
            'vat' => $this->reports->vatReport($from, $to),
            'customers' => $this->reports->customerReport($from, $to),
            'outstanding' => $this->reports->outstandingReport(),
            'payments' => $this->reports->paymentReport($from, $to),
        };
    }

    private function assertValidType(string $type): void
    {
        abort_unless(array_key_exists($type, self::REPORTS), 404, 'Unknown report type.');
    }
}
