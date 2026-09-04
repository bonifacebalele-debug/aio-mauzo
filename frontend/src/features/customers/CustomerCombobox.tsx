"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";
import type { Customer } from "@/lib/api/types";
import { useCustomerSearch } from "./hooks";

interface CustomerComboboxProps {
  value: Customer | null;
  onChange: (customer: Customer) => void;
  error?: string;
}

export function CustomerCombobox({ value, onChange, error }: CustomerComboboxProps) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: results, isFetching } = useCustomerSearch(term);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3.5 text-sm",
          "focus:outline-none focus:border-primary focus:ring-2 focus:ring-[var(--ring)]",
          error && "border-[var(--danger)]",
        )}
      >
        <span className={value ? "text-foreground" : "text-foreground-faint"}>
          {value ? value.company_name : "Select a customer…"}
        </span>
        <ChevronDown className="h-4 w-4 text-foreground-faint" />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-xl">
          <div className="relative border-b border-[var(--border)] p-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-faint" />
            <Input
              autoFocus
              placeholder="Search customers…"
              className="h-8 pl-8 text-sm"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
          <div className="max-h-56 overflow-y-auto scrollbar-thin py-1">
            {isFetching && <p className="px-3 py-2 text-xs text-foreground-faint">Searching…</p>}
            {!isFetching && term.length > 1 && results?.length === 0 && (
              <p className="px-3 py-2 text-xs text-foreground-faint">No customers found.</p>
            )}
            {!isFetching && term.length <= 1 && (
              <p className="px-3 py-2 text-xs text-foreground-faint">Type at least 2 characters to search.</p>
            )}
            {results?.map((customer) => (
              <button
                key={customer.id}
                type="button"
                onClick={() => {
                  onChange(customer);
                  setOpen(false);
                  setTerm("");
                }}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-[var(--neutral-bg)]"
              >
                <span>
                  <span className="block font-medium">{customer.company_name}</span>
                  <span className="block text-xs text-foreground-faint">{customer.phone ?? customer.email}</span>
                </span>
                {value?.id === customer.id && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
