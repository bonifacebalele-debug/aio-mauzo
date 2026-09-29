import { apiClient } from "./client";
import { downloadBlob, filenameFromContentDisposition } from "@/lib/utils/download";
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

/**
 * Downloads a report export via an authenticated XHR request rather than a
 * plain `<a href>` navigation. A direct navigation to the API domain drops
 * the Referer header (our export links use rel="noopener noreferrer"),
 * which Sanctum relies on to recognize the request as coming from the SPA
 * and treat the session cookie as valid — without it the request looks
 * unauthenticated even though the user is logged in. Fetching the file
 * through the same axios client used everywhere else sidesteps that
 * entirely, since it already reliably carries the session.
 */
export async function downloadReportExport(
  type: ReportType,
  format: "pdf" | "csv" | "xlsx",
  filters: ReportFilters = {},
): Promise<void> {
  const response = await apiClient.get(`/reports/${type}/export`, {
    params: { format, ...filters },
    responseType: "blob",
  });

  const fallback = `${type}-report.${format}`;
  downloadBlob(response.data, filenameFromContentDisposition(response.headers["content-disposition"], fallback));
}
