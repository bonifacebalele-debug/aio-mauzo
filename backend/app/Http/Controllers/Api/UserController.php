<?php

namespace App\Http\Controllers\Api;

use App\DTOs\UserData;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $users,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        $paginator = $this->users->list(
            $request->only(['search', 'role', 'is_active']),
            (int) $request->integer('per_page', 15),
        );

        return response()->json([
            'data' => UserResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->users->create(
            UserData::fromArray($request->validated()),
            $request->user(),
        );

        return response()->json(['data' => new UserResource($user)], 201);
    }

    public function show(User $user): JsonResponse
    {
        $this->authorize('view', $user);

        return response()->json(['data' => new UserResource($user->load('roles'))]);
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        try {
            $user = $this->users->update(
                $user,
                UserData::fromArray($request->validated()),
                $request->user(),
            );
        } catch (InvalidArgumentException $e) {
            throw ValidationException::withMessages(['is_active' => $e->getMessage()]);
        }

        return response()->json(['data' => new UserResource($user)]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        try {
            $this->users->delete($user, $request->user());
        } catch (InvalidArgumentException $e) {
            throw ValidationException::withMessages(['user' => $e->getMessage()]);
        }

        return response()->json(['message' => 'User deleted.']);
    }
}
