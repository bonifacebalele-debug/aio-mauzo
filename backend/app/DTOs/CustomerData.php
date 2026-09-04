<?php

namespace App\DTOs;

readonly class CustomerData
{
    public function __construct(
        public string $companyName,
        public ?string $contactPerson,
        public ?string $phone,
        public ?string $email,
        public ?string $tin,
        public ?string $vrn,
        public ?string $physicalAddress,
        public ?string $postalAddress,
        public ?string $country,
        public ?string $city,
        public ?string $notes,
        public bool $isActive = true,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            companyName: $data['company_name'],
            contactPerson: $data['contact_person'] ?? null,
            phone: $data['phone'] ?? null,
            email: $data['email'] ?? null,
            tin: $data['tin'] ?? null,
            vrn: $data['vrn'] ?? null,
            physicalAddress: $data['physical_address'] ?? null,
            postalAddress: $data['postal_address'] ?? null,
            country: $data['country'] ?? null,
            city: $data['city'] ?? null,
            notes: $data['notes'] ?? null,
            isActive: $data['is_active'] ?? true,
        );
    }

    public function toArray(): array
    {
        return [
            'company_name' => $this->companyName,
            'contact_person' => $this->contactPerson,
            'phone' => $this->phone,
            'email' => $this->email,
            'tin' => $this->tin,
            'vrn' => $this->vrn,
            'physical_address' => $this->physicalAddress,
            'postal_address' => $this->postalAddress,
            'country' => $this->country,
            'city' => $this->city,
            'notes' => $this->notes,
            'is_active' => $this->isActive,
        ];
    }
}
