"use client";

import { Loader2, Trash2, Upload } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { extractErrorMessage } from "@/lib/api/client";
import type { BrandingAsset } from "@/lib/api/branding";
import { toast } from "@/store/toast-store";
import { useDeleteBrandingAsset, useUploadBrandingAsset } from "./hooks";

interface BrandingUploadCardProps {
  asset: BrandingAsset;
  title: string;
  description: string;
  imageUrl: string | null;
  children?: ReactNode;
  readOnly?: boolean;
}

export function BrandingUploadCard({
  asset,
  title,
  description,
  imageUrl,
  children,
  readOnly = false,
}: BrandingUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadBrandingAsset();
  const remove = useDeleteBrandingAsset();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await upload.mutateAsync({ asset, file });
      toast.success(`${title} updated.`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      e.target.value = "";
    }
  };

  const handleRemove = async () => {
    try {
      await remove.mutateAsync(asset);
      toast.success(`${title} removed.`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const busy = upload.isPending || remove.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-foreground-muted">{description}</p>

        <div className="flex items-start gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] bg-[var(--neutral-bg)]">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- externally-hosted, dynamically-uploaded asset
              <img src={imageUrl} alt={title} className="h-full w-full object-contain p-2" />
            ) : (
              <Upload className="h-6 w-6 text-foreground-faint" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy || readOnly}
              onClick={() => inputRef.current?.click()}
            >
              {upload.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {imageUrl ? "Replace" : "Upload"}
            </Button>
            {imageUrl && (
              <Button type="button" variant="ghost" size="sm" disabled={busy || readOnly} onClick={handleRemove}>
                {remove.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Remove
              </Button>
            )}
          </div>
        </div>

        {imageUrl && children && <div className="mt-4 border-t border-[var(--border)] pt-4">{children}</div>}
      </CardContent>
    </Card>
  );
}
