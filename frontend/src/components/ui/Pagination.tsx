import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import type { PaginationMeta } from "@/lib/api/types";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (meta.last_page <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3">
      <p className="text-xs text-foreground-faint">
        Page {meta.current_page} of {meta.last_page} · {meta.total} total
      </p>
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
    </div>
  );
}
