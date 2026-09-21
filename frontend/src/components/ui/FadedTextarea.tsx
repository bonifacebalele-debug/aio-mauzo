"use client";

import { forwardRef, useImperativeHandle, useRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface FadedTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * A multi-line text field where the first line renders in the normal
 * foreground color and every line after it renders a little faded — meant
 * for an item description whose first line is the headline and any
 * further lines are supporting detail.
 *
 * It's a real <textarea>, so Enter always inserts a newline like any
 * multi-line field (never submits the enclosing form) — only a plain
 * <input> submits on Enter, which is what the single-line field this
 * replaces used to do.
 *
 * CSS can't style individual lines inside a real textarea's own text, so
 * this stacks a transparent textarea (visible caret, invisible text) over
 * a backdrop <div> that mirrors the same text with per-line coloring, and
 * keeps their scroll position in sync.
 */
export const FadedTextarea = forwardRef<HTMLTextAreaElement, FadedTextareaProps>(
  ({ value, onChange, error, className, rows = 2, onScroll, ...props }, forwardedRef) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => innerRef.current as HTMLTextAreaElement);

    const firstNewline = value.indexOf("\n");
    const firstLine = firstNewline === -1 ? value : value.slice(0, firstNewline);
    const restLines = firstNewline === -1 ? "" : value.slice(firstNewline);

    const syncScroll = () => {
      if (backdropRef.current && innerRef.current) {
        backdropRef.current.scrollTop = innerRef.current.scrollTop;
        backdropRef.current.scrollLeft = innerRef.current.scrollLeft;
      }
    };

    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] transition-colors",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-[var(--ring)]",
          error && "border-[var(--danger)] focus-within:border-[var(--danger)]",
        )}
      >
        <div
          ref={backdropRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words px-3.5 py-2.5 text-sm"
        >
          <span className="text-foreground">{firstLine}</span>
          <span className="text-foreground-muted">{restLines}</span>
        </div>
        <textarea
          ref={innerRef}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={(e) => {
            syncScroll();
            onScroll?.(e);
          }}
          className={cn(
            "relative w-full resize-y bg-transparent px-3.5 py-2.5 text-sm text-transparent " +
              "caret-foreground placeholder:text-foreground-faint focus:outline-none " +
              "disabled:opacity-50 disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
FadedTextarea.displayName = "FadedTextarea";
