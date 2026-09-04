<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboard) {}

    public function stats(Request $request): JsonResponse
    {
        $range = $this->dateRange($request);

        return response()->json(['data' => $this->dashboard->stats($range['from'], $range['to'])]);
    }

    public function monthlyIncome(Request $request): JsonResponse
    {
        $range = $this->dateRange($request);

        return response()->json([
            'data' => $this->dashboard->monthlyIncome((int) $request->integer('months', 12), $range['from'], $range['to']),
        ]);
    }

    public function monthlyInvoices(Request $request): JsonResponse
    {
        $range = $this->dateRange($request);

        return response()->json([
            'data' => $this->dashboard->monthlyInvoiceCounts((int) $request->integer('months', 12), $range['from'], $range['to']),
        ]);
    }

    public function latestCustomers(Request $request): JsonResponse
    {
        $range = $this->dateRange($request);

        return response()->json([
            'data' => CustomerResource::collection(
                $this->dashboard->latestCustomers((int) $request->integer('limit', 5), $range['from'], $range['to'])
            ),
        ]);
    }

    public function latestPayments(Request $request): JsonResponse
    {
        $range = $this->dateRange($request);

        $payments = $this->dashboard->latestPayments((int) $request->integer('limit', 5), $range['from'], $range['to'])
            ->map(fn ($payment) => [
                'id' => $payment->id,
                'amount' => (float) $payment->amount,
                'payment_date' => $payment->payment_date->toDateString(),
                'payment_method' => $payment->payment_method,
                'invoice_number' => $payment->invoice?->invoice_number,
                'customer_name' => $payment->invoice?->customer?->company_name,
            ]);

        return response()->json(['data' => $payments]);
    }

    public function topCustomers(Request $request): JsonResponse
    {
        $range = $this->dateRange($request);

        $customers = $this->dashboard->topCustomers((int) $request->integer('limit', 5), $range['from'], $range['to'])
            ->map(fn ($customer) => [
                'id' => $customer->id,
                'company_name' => $customer->company_name,
                'total_invoiced' => (float) $customer->total_invoiced,
            ]);

        return response()->json(['data' => $customers]);
    }

    public function recentActivity(Request $request): JsonResponse
    {
        $range = $this->dateRange($request);

        $activity = $this->dashboard->recentActivity((int) $request->integer('limit', 10), $range['from'], $range['to'])
            ->map(fn ($log) => [
                'id' => $log->id,
                'action' => $log->action,
                'description' => $log->description,
                'user_name' => $log->user?->name,
                'created_at' => $log->created_at,
            ]);

        return response()->json(['data' => $activity]);
    }

    /**
     * @return array{from: ?string, to: ?string}
     */
    private function dateRange(Request $request): array
    {
        $validated = $request->validate([
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
        ]);

        return [
            'from' => $validated['from'] ?? null,
            'to' => $validated['to'] ?? null,
        ];
    }
}
