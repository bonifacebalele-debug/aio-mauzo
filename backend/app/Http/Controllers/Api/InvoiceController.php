<?php

namespace App\Http\Controllers\Api;

use App\DTOs\InvoiceData;
use App\Enums\InvoiceStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Invoice\SendInvoiceEmailRequest;
use App\Http\Requests\Invoice\StoreInvoiceRequest;
use App\Http\Requests\Invoice\UpdateInvoiceRequest;
use App\Http\Requests\Invoice\UpdateInvoiceStatusRequest;
use App\Http\Resources\EmailLogResource;
use App\Http\Resources\InvoiceResource;
use App\Models\Invoice;
use App\Services\InvoiceEmailService;
use App\Services\InvoiceGeneratorService;
use App\Services\InvoiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class InvoiceController extends Controller
{
    public function __construct(
        private readonly InvoiceService $invoices,
        private readonly InvoiceGeneratorService $invoiceGenerator,
        private readonly InvoiceEmailService $invoiceEmail,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Invoice::class);

        $paginator = $this->invoices->list(
            $request->only(['search', 'status', 'customer_id', 'date_from', 'date_to']),
            (int) $request->integer('per_page', 15),
        );

        return response()->json([
            'data' => InvoiceResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function store(StoreInvoiceRequest $request): JsonResponse
    {
        $invoice = $this->invoices->create(
            InvoiceData::fromArray($request->validated()),
            $request->user(),
        );

        return response()->json(['data' => new InvoiceResource($invoice)], 201);
    }

    public function show(Invoice $invoice): JsonResponse
    {
        $this->authorize('view', $invoice);

        $invoice->load(['items', 'customer', 'currency', 'history.user']);

        return response()->json(['data' => new InvoiceResource($invoice)]);
    }

    public function update(UpdateInvoiceRequest $request, Invoice $invoice): JsonResponse
    {
        $invoice = $this->invoices->update(
            $invoice,
            InvoiceData::fromArray($request->validated()),
            $request->user(),
        );

        return response()->json(['data' => new InvoiceResource($invoice)]);
    }

    public function destroy(Request $request, Invoice $invoice): JsonResponse
    {
        $this->authorize('delete', $invoice);

        $this->invoices->delete($invoice, $request->user());

        return response()->json(['message' => 'Invoice deleted.']);
    }

    public function duplicate(Request $request, Invoice $invoice): JsonResponse
    {
        $this->authorize('duplicate', $invoice);

        $duplicate = $this->invoices->duplicate($invoice, $request->user());

        return response()->json(['data' => new InvoiceResource($duplicate)], 201);
    }

    public function updateStatus(UpdateInvoiceStatusRequest $request, Invoice $invoice): JsonResponse
    {
        try {
            $invoice = $this->invoices->updateStatus(
                $invoice,
                InvoiceStatus::from($request->validated('status')),
                $request->user(),
            );
        } catch (\InvalidArgumentException $e) {
            throw ValidationException::withMessages(['status' => [$e->getMessage()]]);
        }

        return response()->json(['data' => new InvoiceResource($invoice)]);
    }

    public function pdf(Request $request, Invoice $invoice): JsonResponse
    {
        $this->authorize('generatePdf', $invoice);

        $invoice = $this->invoiceGenerator->generate($invoice, $request->user());

        return response()->json([
            'data' => [
                'pdf_url' => $this->invoiceGenerator->pdfUrl($invoice),
                'generated_at' => $invoice->pdf_generated_at,
            ],
        ]);
    }

    public function sendEmail(SendInvoiceEmailRequest $request, Invoice $invoice): JsonResponse
    {
        $log = $this->invoiceEmail->send(
            $invoice,
            $request->validated('to_email'),
            $request->validated('subject'),
            $request->validated('message'),
            $request->user(),
        );

        return response()->json(['data' => new EmailLogResource($log)], $log->status === 'sent' ? 200 : 502);
    }

    public function emailHistory(Invoice $invoice): JsonResponse
    {
        $this->authorize('view', $invoice);

        return response()->json([
            'data' => EmailLogResource::collection($invoice->emailLogs()->latest()->get()),
        ]);
    }
}
