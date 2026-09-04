"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils/cn";
import { BrandingSettings } from "@/features/settings/BrandingSettings";
import { CompanySettingsForm } from "@/features/settings/CompanySettingsForm";
import { useCompanySettings, useUpdateCompanySettings } from "@/features/settings/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { toast } from "@/store/toast-store";

const TABS = [
  { key: "profile", label: "Company Profile" },
  { key: "branding", label: "Branding" },
] as const;

export default function CompanySettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("profile");
  const { data: company, isLoading } = useCompanySettings();
  const updateSettings = useUpdateCompanySettings();

  if (isLoading || !company) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-foreground-faint" />
      </div>
    );
  }

  const handleSubmit = async (values: Parameters<typeof updateSettings.mutateAsync>[0]) => {
    try {
      await updateSettings.mutateAsync(values);
      toast.success("Company settings updated.");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div>
      <PageHeader title="Company Settings" description="Branding, invoice numbering, and default invoice text" />

      <div className="mb-6 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.key ? "bg-primary text-primary-foreground" : "text-foreground-muted hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        {tab === "profile" ? (
          <CompanySettingsForm company={company} onSubmit={handleSubmit} />
        ) : (
          <BrandingSettings company={company} />
        )}
      </div>
    </div>
  );
}
