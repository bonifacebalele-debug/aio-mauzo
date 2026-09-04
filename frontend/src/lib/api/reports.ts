import { API_URL, apiClient } from "./client";
import type { PeriodSummaryPoint, ReportResponse, ReportType } from "./types";

export interface ReportFilters {
  from?: string;
  to?: string;
}

export async function fetchReport(type: ReportType, filters: ReportFilters = {}): Promise<ReportResponse> {
  const { data } = await apiClient.get<ReportResponse>(`/reports/${type}`, { params: filters });

  return data;
}

export async function fetchPeriodSummary(period: "monthly" | "yearly", year: number): Promise<PeriodSummaryPoint[]> {
  const { data } = await apiClient.get<{ data: PeriodSummaryPoint[] }>("/reports/summary", {
    params: { period, year },
  });

  return data.data;
}

export function getReportExportUrl(type: ReportType, format: "pdf" | "csv" | "xlsx", filters: ReportFilters = {}): string {
  const params = new URLSearchParams({ format, ...filters } as Record<string, string>);

  return `${API_URL}/api/reports/${type}/export?${params.toString()}`;
}
