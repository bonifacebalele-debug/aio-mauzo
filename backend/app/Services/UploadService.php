<?php

namespace App\Services;

use App\Models\Upload;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\PngEncoder;
use Intervention\Image\ImageManager;

/**
 * Handles branding image uploads (logo, signature, stamp): resizes to a
 * sane maximum, preserves transparency for PNG, and tracks the file in the
 * generic `uploads` table so it shows up in a future uploads manager.
 */
class UploadService
{
    private readonly ImageManager $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver);
    }

    /**
     * Store an uploaded image under the given directory, capping its longest
     * side at $maxDimension while preserving aspect ratio and transparency.
     */
    public function storeImage(
        UploadedFile $file,
        string $directory,
        User $uploader,
        Model $uploadable,
        int $maxDimension = 800,
    ): string {
        // SVGs are vector — store as-is rather than rasterizing through GD.
        if ($file->getClientOriginalExtension() === 'svg' || $file->getMimeType() === 'image/svg+xml') {
            $filename = Str::uuid()->toString().'.svg';
            $path = "{$directory}/{$filename}";
            Storage::disk('public')->put($path, file_get_contents($file->getRealPath()));
            $mimeType = 'image/svg+xml';
        } else {
            $image = $this->manager->decodePath($file->getRealPath());
            $image->scaleDown($maxDimension, $maxDimension);

            $filename = Str::uuid()->toString().'.png';
            $path = "{$directory}/{$filename}";
            Storage::disk('public')->put($path, (string) $image->encode(new PngEncoder));
            $mimeType = 'image/png';
        }

        Upload::create([
            'uploadable_type' => $uploadable::class,
            'uploadable_id' => $uploadable->getKey(),
            'disk' => 'public',
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $mimeType,
            'size' => Storage::disk('public')->size($path),
            'uploaded_by' => $uploader->id,
        ]);

        return $path;
    }

    public function delete(?string $path): void
    {
        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}
