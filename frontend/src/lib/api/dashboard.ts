import { apiClient } from "./client";
import type {
  ActivityEntry,
  ApiResponse,
  ChartPoint,
  Customer,
  DashboardStats,
  LatestPayment,
  TopCustomer,
} from "./types";

export interface DashboardFilters {
  from?: string;
  to?: string;
}

export async function fetchDashboardStats(filters: DashboardFilters = {}): Promise<DashboardStats> {
  const { data } = await apiClient.get<ApiResponse<DashboardStats>>("/dashboard/stats", { params: filters });

  return data.data;
}

export async function fetchMonthlyIncome(months = 12, filters: DashboardFilters = {}): Promise<ChartPoint[]> {
  const { data } = await apiClient.get<ApiResponse<ChartPoint[]>>("/dashboard/charts/monthly-income", {
    params: { months, ...filters },
  });

  return data.data;
}

export async function fetchMonthlyInvoices(months = 12, filters: DashboardFilters = {}): Promise<ChartPoint[]> {
  const { data } = await apiClient.get<ApiResponse<ChartPoint[]>>("/dashboard/charts/monthly-invoices", {
    params: { months, ...filters },
  });

  return data.data;
}

export async function fetchLatestCustomers(limit = 5, filters: DashboardFilters = {}): Promise<Customer[]> {
  const { data } = await apiClient.get<ApiResponse<Customer[]>>("/dashboard/latest-customers", {
    params: { limit, ...filters },
  });

  return data.data;
}

export async function fetchLatestPayments(limit = 5, filters: DashboardFilters = {}): Promise<LatestPayment[]> {
  const { data } = await apiClient.get<ApiResponse<LatestPayment[]>>("/dashboard/latest-payments", {
    params: { limit, ...filters },
  });

  return data.data;
}

export async function fetchTopCustomers(limit = 5, filters: DashboardFilters = {}): Promise<TopCustomer[]> {
  const { data } = await apiClient.get<ApiResponse<TopCustomer[]>>("/dashboard/top-customers", {
    params: { limit, ...filters },
  });

  return data.data;
}

export async function fetchRecentActivity(limit = 10, filters: DashboardFilters = {}): Promise<ActivityEntry[]> {
  const { data } = await apiClient.get<ApiResponse<ActivityEntry[]>>("/dashboard/recent-activity", {
    params: { limit, ...filters },
  });

  return data.data;
}
