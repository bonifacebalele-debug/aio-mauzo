import { useQuery } from "@tanstack/react-query";
import { fetchActivityLogs, type ActivityLogFilters } from "@/lib/api/activityLogs";

export function useActivityLogs(filters: ActivityLogFilters) {
  return useQuery({
    queryKey: ["activity-logs", filters],
    queryFn: () => fetchActivityLogs(filters),
    placeholderData: (prev) => prev,
  });
}
