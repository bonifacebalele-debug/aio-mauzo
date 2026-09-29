/**
 * Triggers a browser download for an already-fetched blob, without
 * navigating the page away. Used for authenticated file downloads where a
 * plain `<a href>` to the API can't carry the session along (see
 * `downloadFile` below for why).
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * Pulls a filename out of a `Content-Disposition: attachment;
 * filename="…"` response header, falling back to the given default when
 * the header is missing or doesn't match the expected shape.
 */
export function filenameFromContentDisposition(header: string | undefined, fallback: string): string {
  if (!header) return fallback;

  const match = header.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);

  return match?.[1] ? decodeURIComponent(match[1]) : fallback;
}
