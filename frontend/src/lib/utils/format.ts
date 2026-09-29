import { formatDistanceToNowStrict } from "date-fns";

export function formatMoney(amount: number, currencySymbol = ""): string {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return currencySymbol ? `${currencySymbol} ${formatted}` : formatted;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

/** e.g. "5m ago", "2h ago" — used for chat messages and notifications. */
export function formatRelativeTime(value: string | null | undefined): string {
  if (!value) return "";

  return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}
