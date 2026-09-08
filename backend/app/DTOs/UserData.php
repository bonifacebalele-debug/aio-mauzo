<?php

namespace App\DTOs;

readonly class UserData
{
    public function __construct(
        public string $name,
        public string $email,
        public ?string $phone,
        public ?string $password,
        public string $role,
        public bool $isActive = true,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            phone: $data['phone'] ?? null,
            password: $data['password'] ?? null,
            role: $data['role'],
            isActive: $data['is_active'] ?? true,
        );
    }

    /**
     * Fields for User::create()/update() — excludes `role`, which is
     * assigned separately via Spatie's syncRoles(), and `password`,
     * which the service hashes and only sets when provided.
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'is_active' => $this->isActive,
        ];
    }
}
