import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import type { PaginationMeta } from "@/lib/api/types";

const DEFAULT_PER_PAGE_OPTIONS = [10, 15, 25, 50, 100];

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  /** Omit to hide the "Per page" selector entirely (falls back to the old, fixed-page-size behavior). */
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
}

export function Pagination({
  meta,
  onPageChange,
  onPerPageChange,
  perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
}: PaginationProps) {
  if (meta.last_page <= 1 && !onPerPageChange) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--border)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {onPerPageChange && (
          <label className="flex items-center gap-1.5 text-xs text-foreground-faint">
            Per page
            <select
              value={meta.per_page}
              onChange={(e) => onPerPageChange(Number(e.target.value))}
              className="appearance-none rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] py-1 pl-2 pr-6 text-xs text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-[var(--ring)]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235c6072' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.15rem center",
                backgroundSize: "14px",
              }}
            >
              {perPageOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className="text-xs text-foreground-faint">
          Page {meta.current_page} of {meta.last_page} · {meta.total} total
        </p>
      </div>

      {meta.last_page > 1 && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={meta.current_page <= 1}
            onClick={() => onPageChange(meta.current_page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={meta.current_page >= meta.last_page}
            onClick={() => onPageChange(meta.current_page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
