<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateCompanySettingsRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;

class CompanySettingsController extends Controller
{
    public function __construct(private readonly ActivityLogger $activityLogger) {}

    public function show(): JsonResponse
    {
        $company = Company::query()->with(['defaultCurrency', 'bankAccounts'])->firstOrFail();

        return response()->json(['data' => new CompanyResource($company)]);
    }

    public function update(UpdateCompanySettingsRequest $request): JsonResponse
    {
        $company = Company::query()->firstOrFail();
        $company->update($request->validated());

        $this->activityLogger->log($request->user(), 'settings.company_updated', $company, 'Updated company profile settings');

        return response()->json(['data' => new CompanyResource($company->fresh(['defaultCurrency', 'bankAccounts']))]);
    }
}
