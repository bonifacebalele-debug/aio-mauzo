import { apiClient } from "./client";
import { downloadBlob, filenameFromContentDisposition } from "@/lib/utils/download";
import type { ApiResponse, DeliveryNote } from "./types";

export async function generateDeliveryNote(invoiceId: number): Promise<DeliveryNote> {
  const { data } = await apiClient.post<ApiResponse<DeliveryNote>>(`/invoices/${invoiceId}/delivery-note`);

  return data.data;
}

/**
 * Downloads the delivery note PDF via an authenticated XHR request rather
 * than a plain `<a href>` navigation — see the matching note on
 * `downloadReportExport` in reports.ts for why a direct link to the API
 * comes back "Unauthenticated" even when the user is signed in.
 */
export async function downloadDeliveryNotePdf(invoiceId: number, deliveryNoteNumber?: string): Promise<void> {
  const response = await apiClient.get(`/invoices/${invoiceId}/delivery-note/pdf`, {
    responseType: "blob",
  });

  const fallback = `${deliveryNoteNumber ?? "delivery-note"}.pdf`;
  downloadBlob(response.data, filenameFromContentDisposition(response.headers["content-disposition"], fallback));
}

export async function markDeliveryNoteDelivered(
  deliveryNoteId: number,
  receivedByName?: string,
): Promise<DeliveryNote> {
  const { data } = await apiClient.patch<ApiResponse<DeliveryNote>>(`/delivery-notes/${deliveryNoteId}/deliver`, {
    received_by_name: receivedByName || undefined,
  });

  return data.data;
}
