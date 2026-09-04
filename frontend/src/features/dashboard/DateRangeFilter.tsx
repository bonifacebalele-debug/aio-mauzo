"use client";

import { useMemo } from "react";
import { Input, Label } from "@/components/ui/Input";
import type { DashboardFilters } from "@/lib/api/dashboard";
import { cn } from "@/lib/utils/cn";

interface DateRangeFilterProps {
  value: DashboardFilters;
  onChange: (value: DashboardFilters) => void;
}

function toDateString(date: Date): string {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function daysAgo(n: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - n);
  return date;
}

function buildPresets(): { label: string; range: DashboardFilters }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  return [
    { label: "All time", range: {} },
    { label: "Today", range: { from: toDateString(today), to: toDateString(today) } },
    { label: "Last 7 days", range: { from: toDateString(daysAgo(6)), to: toDateString(today) } },
    { label: "Last 30 days", range: { from: toDateString(daysAgo(29)), to: toDateString(today) } },
    { label: "This month", range: { from: toDateString(startOfMonth), to: toDateString(today) } },
    { label: "This year", range: { from: toDateString(startOfYear), to: toDateString(today) } },
  ];
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const presets = useMemo(buildPresets, []);
  const activeLabel = presets.find((preset) => preset.range.from === value.from && preset.range.to === value.to)?.label;

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onChange(preset.range)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              activeLabel === preset.label
                ? "border-primary bg-primary text-primary-foreground"
                : "border-[var(--border)] bg-[var(--surface)] text-foreground-muted hover:text-foreground",
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-2">
        <div>
          <Label htmlFor="dashboard-range-from">From</Label>
          <Input
            id="dashboard-range-from"
            type="date"
            value={value.from ?? ""}
            max={value.to || undefined}
            onChange={(e) => onChange({ ...value, from: e.target.value || undefined })}
          />
        </div>
        <div>
          <Label htmlFor="dashboard-range-to">To</Label>
          <Input
            id="dashboard-range-to"
            type="date"
            value={value.to ?? ""}
            min={value.from || undefined}
            onChange={(e) => onChange({ ...value, to: e.target.value || undefined })}
          />
        </div>
      </div>
    </div>
  );
}
