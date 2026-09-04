import { useQuery } from "@tanstack/react-query";
import { fetchPeriodSummary, fetchReport, type ReportFilters } from "@/lib/api/reports";
import type { ReportType } from "@/lib/api/types";

export function useReport(type: ReportType, filters: ReportFilters) {
  return useQuery({
    queryKey: ["reports", type, filters],
    queryFn: () => fetchReport(type, filters),
  });
}

export function usePeriodSummary(period: "monthly" | "yearly", year: number) {
  return useQuery({
    queryKey: ["reports", "summary", period, year],
    queryFn: () => fetchPeriodSummary(period, year),
  });
}
