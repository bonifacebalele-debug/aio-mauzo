<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Models\ActivityLog;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function stats(?string $from = null, ?string $to = null): array
    {
        $hasRange = $from !== null || $to !== null;

        $statusCounts = $this->applyDateRange(Invoice::query(), 'invoice_date', $from, $to)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $periodSales = $hasRange
            ? (float) $this->applyDateRange(Invoice::query(), 'invoice_date', $from, $to)->sum('grand_total')
            : (float) Invoice::query()->whereDate('invoice_date', Carbon::today())->sum('grand_total');

        $revenue = (float) $this->applyDateRange(Invoice::query(), 'paid_at', $from, $to)
            ->where('status', InvoiceStatus::Paid->value)
            ->sum('grand_total');

        $outstanding = (float) $this->applyDateRange(Invoice::query(), 'invoice_date', $from, $to)
            ->whereNotIn('status', [InvoiceStatus::Paid->value, InvoiceStatus::Cancelled->value])
            ->sum(DB::raw('grand_total - amount_paid'));

        return [
            'todays_sales' => $periodSales,
            'revenue' => $revenue,
            'outstanding_balance' => $outstanding,
            'customers_count' => Customer::query()->where('is_active', true)->count(),
            'invoices' => [
                'total' => (int) $statusCounts->sum(),
                'draft' => (int) ($statusCounts[InvoiceStatus::Draft->value] ?? 0),
                'sent' => (int) ($statusCounts[InvoiceStatus::Sent->value] ?? 0),
                'viewed' => (int) ($statusCounts[InvoiceStatus::Viewed->value] ?? 0),
                'paid' => (int) ($statusCounts[InvoiceStatus::Paid->value] ?? 0),
                'pending' => (int) (($statusCounts[InvoiceStatus::Sent->value] ?? 0) + ($statusCounts[InvoiceStatus::Viewed->value] ?? 0)),
                'overdue' => (int) ($statusCounts[InvoiceStatus::Overdue->value] ?? 0),
                'cancelled' => (int) ($statusCounts[InvoiceStatus::Cancelled->value] ?? 0),
            ],
        ];
    }

    public function monthlyIncome(int $months = 12, ?string $from = null, ?string $to = null): array
    {
        [$start, $end, $months] = $this->resolveSeriesRange($months, $from, $to);

        $rows = Invoice::query()
            ->select(
                DB::raw('YEAR(paid_at) as year'),
                DB::raw('MONTH(paid_at) as month'),
                DB::raw('SUM(grand_total) as total'),
            )
            ->where('status', InvoiceStatus::Paid->value)
            ->whereBetween('paid_at', [$start, $end])
            ->groupBy('year', 'month')
            ->get()
            ->keyBy(fn ($row) => "{$row->year}-{$row->month}");

        return $this->fillMonthlySeries($start, $months, $rows, 'total');
    }

    public function monthlyInvoiceCounts(int $months = 12, ?string $from = null, ?string $to = null): array
    {
        [$start, $end, $months] = $this->resolveSeriesRange($months, $from, $to);

        $rows = Invoice::query()
            ->select(
                DB::raw('YEAR(invoice_date) as year'),
                DB::raw('MONTH(invoice_date) as month'),
                DB::raw('COUNT(*) as total'),
            )
            ->whereBetween('invoice_date', [$start, $end])
            ->groupBy('year', 'month')
            ->get()
            ->keyBy(fn ($row) => "{$row->year}-{$row->month}");

        return $this->fillMonthlySeries($start, $months, $rows, 'total');
    }

    public function latestCustomers(int $limit = 5, ?string $from = null, ?string $to = null)
    {
        return $this->applyDateRange(Customer::query(), 'created_at', $from, $to)
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function latestPayments(int $limit = 5, ?string $from = null, ?string $to = null)
    {
        return $this->applyDateRange(
            Payment::query()->with(['invoice:id,invoice_number,customer_id', 'invoice.customer:id,company_name']),
            'payment_date',
            $from,
            $to,
        )
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function topCustomers(int $limit = 5, ?string $from = null, ?string $to = null)
    {
        return Customer::query()
            ->select('customers.*')
            ->selectSub(
                $this->applyDateRange(
                    Invoice::query()
                        ->selectRaw('COALESCE(SUM(grand_total), 0)')
                        ->whereColumn('customer_id', 'customers.id')
                        ->where('status', '!=', InvoiceStatus::Cancelled->value),
                    'invoice_date',
                    $from,
                    $to,
                ),
                'total_invoiced'
            )
            ->orderByDesc('total_invoiced')
            ->limit($limit)
            ->get();
    }

    public function recentActivity(int $limit = 10, ?string $from = null, ?string $to = null)
    {
        return $this->applyDateRange(ActivityLog::query()->with('user:id,name'), 'created_at', $from, $to)
            ->latest()
            ->limit($limit)
            ->get();
    }

    private function applyDateRange(Builder $query, string $column, ?string $from, ?string $to): Builder
    {
        if ($from) {
            $query->whereDate($column, '>=', Carbon::parse($from));
        }
        if ($to) {
            $query->whereDate($column, '<=', Carbon::parse($to));
        }

        return $query;
    }

    /**
     * @return array{0: Carbon, 1: Carbon, 2: int}
     */
    private function resolveSeriesRange(int $months, ?string $from, ?string $to): array
    {
        if ($from || $to) {
            $start = $from ? Carbon::parse($from)->startOfMonth() : Carbon::parse($to)->startOfMonth();
            $end = $to ? Carbon::parse($to)->endOfMonth() : Carbon::now()->endOfMonth();
            $months = max(1, (int) $start->diffInMonths($end) + 1);

            return [$start, $end, $months];
        }

        $start = Carbon::now()->subMonths($months - 1)->startOfMonth();
        $end = Carbon::now()->endOfMonth();

        return [$start, $end, $months];
    }

    private function fillMonthlySeries(Carbon $start, int $months, $rows, string $valueKey): array
    {
        $series = [];
        $cursor = $start->copy();

        for ($i = 0; $i < $months; $i++) {
            $key = "{$cursor->year}-{$cursor->month}";
            $series[] = [
                'label' => $cursor->format('M Y'),
                'value' => (float) ($rows[$key]->{$valueKey} ?? 0),
            ];
            $cursor->addMonth();
        }

        return $series;
    }
}
