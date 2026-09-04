import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCustomer,
  deleteCustomer,
  fetchCustomer,
  fetchCustomers,
  fetchCustomerStatement,
  searchCustomers,
  updateCustomer,
  type CustomerFilters,
  type StatementFilters,
} from "@/lib/api/customers";
import type { CustomerPayload } from "@/lib/api/types";

export function useCustomers(filters: CustomerFilters) {
  return useQuery({
    queryKey: ["customers", filters],
    queryFn: () => fetchCustomers(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCustomer(id: number | undefined) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => fetchCustomer(id as number),
    enabled: id !== undefined,
  });
}

export function useCustomerSearch(term: string) {
  return useQuery({
    queryKey: ["customers", "search", term],
    queryFn: () => searchCustomers(term),
    enabled: term.length > 1,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<CustomerPayload>) => createCustomer(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });
}

export function useUpdateCustomer(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<CustomerPayload>) => updateCustomer(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });
}

export function useCustomerStatement(id: number, filters: StatementFilters) {
  return useQuery({
    queryKey: ["customers", id, "statement", filters],
    queryFn: () => fetchCustomerStatement(id, filters),
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
  });
}
