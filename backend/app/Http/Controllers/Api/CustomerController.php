<?php

namespace App\Http\Controllers\Api;

use App\DTOs\CustomerData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Services\CustomerService;
use App\Services\CustomerStatementService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CustomerController extends Controller
{
    public function __construct(
        private readonly CustomerService $customers,
        private readonly CustomerStatementService $statements,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Customer::class);

        $paginator = $this->customers->list(
            $request->only(['search', 'is_active']),
            (int) $request->integer('per_page', 15),
        );

        return response()->json([
            'data' => CustomerResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $customer = $this->customers->create(
            CustomerData::fromArray($request->validated()),
            $request->user(),
        );

        return response()->json(['data' => new CustomerResource($customer)], 201);
    }

    public function show(Customer $customer): JsonResponse
    {
        $this->authorize('view', $customer);

        return response()->json(['data' => new CustomerResource($customer)]);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse
    {
        $customer = $this->customers->update(
            $customer,
            CustomerData::fromArray($request->validated()),
            $request->user(),
        );

        return response()->json(['data' => new CustomerResource($customer)]);
    }

    public function destroy(Request $request, Customer $customer): JsonResponse
    {
        $this->authorize('delete', $customer);

        $this->customers->delete($customer, $request->user());

        return response()->json(['message' => 'Customer deleted.']);
    }

    public function search(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Customer::class);

        $term = (string) $request->query('q', '');

        return response()->json([
            'data' => CustomerResource::collection($this->customers->search($term)),
        ]);
    }

    public function statement(Request $request, Customer $customer): JsonResponse
    {
        $this->authorize('view', $customer);

        return response()->json([
            'data' => $this->statements->generate($customer, $request->input('from'), $request->input('to')),
        ]);
    }

    public function statementPdf(Request $request, Customer $customer): Response
    {
        $this->authorize('view', $customer);

        $statement = $this->statements->generate($customer, $request->input('from'), $request->input('to'));

        return Pdf::loadView('reports.statement', $statement)
            ->download("statement-{$customer->company_name}-".now()->format('Y-m-d').'.pdf');
    }
}
