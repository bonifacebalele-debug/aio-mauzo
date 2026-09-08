<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CurrencyResource;
use App\Http\Resources\TaxResource;
use App\Models\Currency;
use App\Models\Tax;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;

class ReferenceDataController extends Controller
{
    public function currencies(): JsonResponse
    {
        return response()->json([
            'data' => CurrencyResource::collection(Currency::query()->where('is_active', true)->orderBy('code')->get()),
        ]);
    }

    public function taxes(): JsonResponse
    {
        return response()->json([
            'data' => TaxResource::collection(Tax::query()->where('is_active', true)->orderBy('rate')->get()),
        ]);
    }

    public function roles(): JsonResponse
    {
        return response()->json([
            'data' => Role::query()->orderBy('name')->pluck('name'),
        ]);
    }
}
