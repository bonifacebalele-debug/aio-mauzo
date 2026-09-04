"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ChartPoint } from "@/lib/api/types";

interface ChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: number }>;
  label?: string;
  valueFormatter?: (value: number) => string;
}

function ChartTooltip({ active, payload, label, valueFormatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value ?? 0;

  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-foreground-muted">{label}</p>
      <p className="mt-0.5 font-semibold text-foreground">{valueFormatter ? valueFormatter(value) : value}</p>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  data?: ChartPoint[];
  isLoading: boolean;
  type?: "area" | "bar";
  valueFormatter?: (v: number) => string;
}

export function ChartCard({ title, data, isLoading, type = "area", valueFormatter }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-56 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={224}>
            {type === "area" ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--foreground-faint)", fontSize: 11 }}
                />
                <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} cursor={{ stroke: "var(--border-strong)" }} />
                <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} fill="url(#chartFill)" />
              </AreaChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--foreground-faint)", fontSize: 11 }}
                />
                <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} cursor={{ fill: "var(--neutral-bg)" }} />
                <Bar dataKey="value" fill="var(--secondary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
