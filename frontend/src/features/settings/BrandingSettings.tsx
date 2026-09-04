"use client";

import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label, Select } from "@/components/ui/Input";
import { extractErrorMessage } from "@/lib/api/client";
import type { Company } from "@/lib/api/types";
import { toast } from "@/store/toast-store";
import { BrandingUploadCard } from "./BrandingUploadCard";
import { useUpdateCompanySettings } from "./hooks";

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-foreground-muted">
        <span>{label}</span>
        <span className="tabular-nums text-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary)]"
      />
    </div>
  );
}

export function BrandingSettings({ company }: { company: Company }) {
  const updateSettings = useUpdateCompanySettings();

  const [logoSize, setLogoSize] = useState(company.logo_size);
  const [logoPosition, setLogoPosition] = useState(company.logo_position);

  const [sigEnabled, setSigEnabled] = useState(company.signature_enabled);
  const [sigWidth, setSigWidth] = useState(company.signature_width);
  const [sigX, setSigX] = useState(company.signature_x);
  const [sigY, setSigY] = useState(company.signature_y);

  const [stampEnabled, setStampEnabled] = useState(company.stamp_enabled);
  const [stampWidth, setStampWidth] = useState(company.stamp_width);
  const [stampRotation, setStampRotation] = useState(company.stamp_rotation);
  const [stampOpacity, setStampOpacity] = useState(company.stamp_opacity);
  const [stampX, setStampX] = useState(company.stamp_x);
  const [stampY, setStampY] = useState(company.stamp_y);

  const save = async (payload: Partial<Company>, label: string) => {
    try {
      await updateSettings.mutateAsync(payload);
      toast.success(`${label} saved.`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <BrandingUploadCard
        asset="logo"
        title="Company Logo"
        description="PNG, SVG, JPEG, or WebP. Transparent PNG recommended. Shown on invoice PDFs and the in-app preview."
        imageUrl={company.logo_url}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Size</Label>
            <Select value={logoSize} onChange={(e) => setLogoSize(e.target.value)}>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </Select>
          </div>
          <div>
            <Label>Position</Label>
            <Select value={logoPosition} onChange={(e) => setLogoPosition(e.target.value)}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </Select>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          className="mt-4"
          disabled={updateSettings.isPending}
          onClick={() => save({ logo_size: logoSize, logo_position: logoPosition }, "Logo layout")}
        >
          {updateSettings.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save layout
        </Button>
      </BrandingUploadCard>

      <BrandingUploadCard
        asset="signature"
        title="Digital Signature"
        description="Transparent PNG of an authorized signature, placed on generated invoices when enabled."
        imageUrl={company.signature_url}
      >
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={sigEnabled}
              onChange={(e) => setSigEnabled(e.target.checked)}
              className="h-4 w-4 rounded accent-[var(--primary)]"
            />
            Show signature on invoices
          </label>
          <Slider label="Width (px)" value={sigWidth} min={40} max={400} onChange={setSigWidth} />
          <div className="grid grid-cols-2 gap-4">
            <Slider label="Position X" value={sigX} min={0} max={1000} onChange={setSigX} />
            <Slider label="Position Y" value={sigY} min={0} max={1000} onChange={setSigY} />
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          className="mt-4"
          disabled={updateSettings.isPending}
          onClick={() =>
            save(
              { signature_enabled: sigEnabled, signature_width: sigWidth, signature_x: sigX, signature_y: sigY },
              "Signature settings",
            )
          }
        >
          {updateSettings.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save signature settings
        </Button>
      </BrandingUploadCard>

      <BrandingUploadCard
        asset="stamp"
        title="Company Stamp"
        description="Transparent PNG stamp/seal, placed on generated invoices when enabled."
        imageUrl={company.stamp_url}
      >
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={stampEnabled}
              onChange={(e) => setStampEnabled(e.target.checked)}
              className="h-4 w-4 rounded accent-[var(--primary)]"
            />
            Show stamp on invoices
          </label>
          <Slider label="Width (px)" value={stampWidth} min={40} max={400} onChange={setStampWidth} />
          <Slider label="Rotation (°)" value={stampRotation} min={-180} max={180} onChange={setStampRotation} />
          <Slider label="Opacity (%)" value={stampOpacity} min={10} max={100} onChange={setStampOpacity} />
          <div className="grid grid-cols-2 gap-4">
            <Slider label="Position X" value={stampX} min={0} max={1000} onChange={setStampX} />
            <Slider label="Position Y" value={stampY} min={0} max={1000} onChange={setStampY} />
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          className="mt-4"
          disabled={updateSettings.isPending}
          onClick={() =>
            save(
              {
                stamp_enabled: stampEnabled,
                stamp_width: stampWidth,
                stamp_rotation: stampRotation,
                stamp_opacity: stampOpacity,
                stamp_x: stampX,
                stamp_y: stampY,
              },
              "Stamp settings",
            )
          }
        >
          {updateSettings.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save stamp settings
        </Button>
      </BrandingUploadCard>
    </div>
  );
}
