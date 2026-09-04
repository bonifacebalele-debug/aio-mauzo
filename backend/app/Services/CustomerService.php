<?php

namespace App\Services;

use App\DTOs\CustomerData;
use App\Models\Customer;
use App\Models\User;
use App\Repositories\Contracts\CustomerRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomerService
{
    public function __construct(
        private readonly CustomerRepositoryInterface $customers,
        private readonly ActivityLogger $activityLogger,
    ) {}

    public function list(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->customers->paginate($filters, $perPage);
    }

    public function find(int $id): Customer
    {
        return $this->customers->findOrFail($id);
    }

    public function create(CustomerData $data, User $actor): Customer
    {
        $customer = $this->customers->create([
            ...$data->toArray(),
            'created_by' => $actor->id,
        ]);

        $this->activityLogger->log($actor, 'customer.created', $customer, "Created customer \"{$customer->company_name}\"");

        return $customer;
    }

    public function update(Customer $customer, CustomerData $data, User $actor): Customer
    {
        $customer = $this->customers->update($customer, $data->toArray());

        $this->activityLogger->log($actor, 'customer.updated', $customer, "Updated customer \"{$customer->company_name}\"");

        return $customer;
    }

    public function delete(Customer $customer, User $actor): void
    {
        $name = $customer->company_name;
        $this->customers->delete($customer);

        $this->activityLogger->log($actor, 'customer.deleted', $customer, "Deleted customer \"{$name}\"");
    }

    public function search(string $term): iterable
    {
        return $this->customers->search($term);
    }
}
