import { apiClient } from "./client";
import type {
  ApiResponse,
  EmailLog,
  Invoice,
  InvoicePayload,
  InvoiceStatus,
  PaginatedResponse,
  SendInvoiceEmailPayload,
} from "./types";

export interface InvoiceFilters {
  search?: string;
  status?: InvoiceStatus;
  customer_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

export async function fetchInvoices(filters: InvoiceFilters = {}): Promise<PaginatedResponse<Invoice>> {
  const { data } = await apiClient.get<PaginatedResponse<Invoice>>("/invoices", { params: filters });

  return data;
}

export async function fetchInvoice(id: number): Promise<Invoice> {
  const { data } = await apiClient.get<ApiResponse<Invoice>>(`/invoices/${id}`);

  return data.data;
}

export async function createInvoice(payload: InvoicePayload): Promise<Invoice> {
  const { data } = await apiClient.post<ApiResponse<Invoice>>("/invoices", payload);

  return data.data;
}

export async function updateInvoice(id: number, payload: InvoicePayload): Promise<Invoice> {
  const { data } = await apiClient.put<ApiResponse<Invoice>>(`/invoices/${id}`, payload);

  return data.data;
}

export async function deleteInvoice(id: number): Promise<void> {
  await apiClient.delete(`/invoices/${id}`);
}

export async function duplicateInvoice(id: number): Promise<Invoice> {
  const { data } = await apiClient.post<ApiResponse<Invoice>>(`/invoices/${id}/duplicate`);

  return data.data;
}

export async function updateInvoiceStatus(id: number, status: InvoiceStatus): Promise<Invoice> {
  const { data } = await apiClient.patch<ApiResponse<Invoice>>(`/invoices/${id}/status`, { status });

  return data.data;
}

export async function generateInvoicePdf(id: number): Promise<{ pdf_url: string; generated_at: string }> {
  const { data } = await apiClient.post<ApiResponse<{ pdf_url: string; generated_at: string }>>(
    `/invoices/${id}/pdf`,
  );

  return data.data;
}

export async function sendInvoiceEmail(id: number, payload: SendInvoiceEmailPayload): Promise<EmailLog> {
  const { data } = await apiClient.post<ApiResponse<EmailLog>>(`/invoices/${id}/email`, payload);

  return data.data;
}

export async function fetchInvoiceEmailHistory(id: number): Promise<EmailLog[]> {
  const { data } = await apiClient.get<ApiResponse<EmailLog[]>>(`/invoices/${id}/emails`);

  return data.data;
}
