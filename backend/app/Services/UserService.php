<?php

namespace App\Services;

use App\DTOs\UserData;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use InvalidArgumentException;

class UserService
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly ActivityLogger $activityLogger,
    ) {}

    public function list(array $filters, int $perPage): LengthAwarePaginator
    {
        return $this->users->paginate($filters, $perPage);
    }

    public function find(int $id): User
    {
        return $this->users->findOrFail($id);
    }

    public function create(UserData $data, User $actor): User
    {
        $user = $this->users->create([
            ...$data->toArray(),
            'password' => Hash::make($data->password),
            'email_verified_at' => now(),
        ]);

        $user->syncRoles([$data->role]);

        $this->activityLogger->log($actor, 'user.created', $user, "Created user \"{$user->name}\" ({$data->role})");

        return $user->fresh('roles');
    }

    public function update(User $user, UserData $data, User $actor): User
    {
        if ($actor->is($user) && ! $data->isActive) {
            throw new InvalidArgumentException('You cannot deactivate your own account.');
        }

        $attributes = $data->toArray();
        if ($data->password) {
            $attributes['password'] = Hash::make($data->password);
        }

        $user = $this->users->update($user, $attributes);
        $user->syncRoles([$data->role]);

        $this->activityLogger->log($actor, 'user.updated', $user, "Updated user \"{$user->name}\"");

        return $user->fresh('roles');
    }

    public function delete(User $user, User $actor): void
    {
        if ($actor->is($user)) {
            throw new InvalidArgumentException('You cannot delete your own account.');
        }

        $name = $user->name;
        $this->users->delete($user);

        $this->activityLogger->log($actor, 'user.deleted', null, "Deleted user \"{$name}\"");
    }
}
