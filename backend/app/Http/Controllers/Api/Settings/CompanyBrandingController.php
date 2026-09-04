<?php

namespace App\Http\Controllers\Api\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UploadBrandingAssetRequest;
use App\Http\Resources\CompanyResource;
use App\Models\Company;
use App\Services\ActivityLogger;
use App\Services\UploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyBrandingController extends Controller
{
    private const array ASSET_COLUMNS = [
        'logo' => 'logo_path',
        'signature' => 'signature_path',
        'stamp' => 'stamp_path',
    ];

    public function __construct(
        private readonly UploadService $uploads,
        private readonly ActivityLogger $activityLogger,
    ) {}

    public function upload(UploadBrandingAssetRequest $request, string $asset): JsonResponse
    {
        $this->assertValidAsset($asset);
        $company = Company::query()->firstOrFail();
        $column = self::ASSET_COLUMNS[$asset];

        $this->uploads->delete($company->{$column});

        $path = $this->uploads->storeImage(
            $request->file('file'),
            "branding/{$asset}",
            $request->user(),
            $company,
        );

        $company->update([$column => $path]);
        $this->activityLogger->log($request->user(), "settings.{$asset}_uploaded", $company, ucfirst($asset).' updated');

        return response()->json(['data' => new CompanyResource($company->fresh(['defaultCurrency', 'bankAccounts']))]);
    }

    public function destroy(Request $request, string $asset): JsonResponse
    {
        $this->assertValidAsset($asset);
        $this->authorize('settings.edit');

        $company = Company::query()->firstOrFail();
        $column = self::ASSET_COLUMNS[$asset];

        $this->uploads->delete($company->{$column});
        $company->update([$column => null]);
        $this->activityLogger->log($request->user(), "settings.{$asset}_removed", $company, ucfirst($asset).' removed');

        return response()->json(['data' => new CompanyResource($company->fresh(['defaultCurrency', 'bankAccounts']))]);
    }

    private function assertValidAsset(string $asset): void
    {
        abort_unless(array_key_exists($asset, self::ASSET_COLUMNS), 404, 'Unknown branding asset.');
    }
}
