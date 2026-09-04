import { apiClient } from "./client";
import type { ActivityLogEntry, PaginatedResponse } from "./types";

export interface ActivityLogFilters {
  action?: string;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
}

export async function fetchActivityLogs(filters: ActivityLogFilters = {}): Promise<PaginatedResponse<ActivityLogEntry>> {
  const { data } = await apiClient.get<PaginatedResponse<ActivityLogEntry>>("/activity-logs", { params: filters });

  return data;
}
