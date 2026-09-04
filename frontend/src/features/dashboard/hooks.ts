import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardStats,
  fetchLatestCustomers,
  fetchLatestPayments,
  fetchMonthlyIncome,
  fetchMonthlyInvoices,
  fetchRecentActivity,
  fetchTopCustomers,
  type DashboardFilters,
} from "@/lib/api/dashboard";

export function useDashboardStats(filters: DashboardFilters = {}) {
  return useQuery({
    queryKey: ["dashboard", "stats", filters],
    queryFn: () => fetchDashboardStats(filters),
  });
}

export function useMonthlyIncome(filters: DashboardFilters = {}) {
  return useQuery({
    queryKey: ["dashboard", "monthly-income", filters],
    queryFn: () => fetchMonthlyIncome(6, filters),
  });
}

export function useMonthlyInvoices(filters: DashboardFilters = {}) {
  return useQuery({
    queryKey: ["dashboard", "monthly-invoices", filters],
    queryFn: () => fetchMonthlyInvoices(6, filters),
  });
}

export function useLatestCustomers(filters: DashboardFilters = {}) {
  return useQuery({
    queryKey: ["dashboard", "latest-customers", filters],
    queryFn: () => fetchLatestCustomers(5, filters),
  });
}

export function useLatestPayments(filters: DashboardFilters = {}) {
  return useQuery({
    queryKey: ["dashboard", "latest-payments", filters],
    queryFn: () => fetchLatestPayments(5, filters),
  });
}

export function useTopCustomers(filters: DashboardFilters = {}) {
  return useQuery({
    queryKey: ["dashboard", "top-customers", filters],
    queryFn: () => fetchTopCustomers(5, filters),
  });
}

export function useRecentActivity(filters: DashboardFilters = {}) {
  return useQuery({
    queryKey: ["dashboard", "recent-activity", filters],
    queryFn: () => fetchRecentActivity(8, filters),
  });
}
