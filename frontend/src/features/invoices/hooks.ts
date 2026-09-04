import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInvoice,
  deleteInvoice,
  duplicateInvoice,
  fetchInvoice,
  fetchInvoiceEmailHistory,
  fetchInvoices,
  generateInvoicePdf,
  sendInvoiceEmail,
  updateInvoice,
  updateInvoiceStatus,
  type InvoiceFilters,
} from "@/lib/api/invoices";
import { fetchCurrencies, fetchTaxes } from "@/lib/api/reference";
import type { InvoicePayload, InvoiceStatus, SendInvoiceEmailPayload } from "@/lib/api/types";

export function useInvoices(filters: InvoiceFilters) {
  return useQuery({
    queryKey: ["invoices", filters],
    queryFn: () => fetchInvoices(filters),
    placeholderData: (prev) => prev,
  });
}

export function useInvoice(id: number | undefined) {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: () => fetchInvoice(id as number),
    enabled: id !== undefined,
  });
}

export function useCurrencies() {
  return useQuery({ queryKey: ["currencies"], queryFn: fetchCurrencies, staleTime: 5 * 60_000 });
}

export function useTaxes() {
  return useQuery({ queryKey: ["taxes"], queryFn: fetchTaxes, staleTime: 5 * 60_000 });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InvoicePayload) => createInvoice(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });
}

export function useUpdateInvoice(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InvoicePayload) => updateInvoice(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteInvoice(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });
}

export function useDuplicateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => duplicateInvoice(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: InvoiceStatus }) => updateInvoiceStatus(id, status),
    onSuccess: (invoice) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.setQueryData(["invoices", invoice.id], invoice);
    },
  });
}

export function useGenerateInvoicePdf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => generateInvoicePdf(id),
    onSuccess: (_, id) => queryClient.invalidateQueries({ queryKey: ["invoices", id] }),
  });
}

export function useInvoiceEmailHistory(id: number) {
  return useQuery({
    queryKey: ["invoices", id, "emails"],
    queryFn: () => fetchInvoiceEmailHistory(id),
  });
}

export function useSendInvoiceEmail(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendInvoiceEmailPayload) => sendInvoiceEmail(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices", id, "emails"] });
      queryClient.invalidateQueries({ queryKey: ["invoices", id] });
    },
  });
}
