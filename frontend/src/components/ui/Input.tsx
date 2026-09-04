import {
  forwardRef,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils/cn";

const fieldClasses =
  "w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3.5 h-10 text-sm text-foreground " +
  "placeholder:text-foreground-faint transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-[var(--ring)] " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(fieldClasses, error && "border-[var(--danger)] focus:border-[var(--danger)]", className)}
    {...props}
  />
));
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, error, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(fieldClasses, "h-auto min-h-20 py-2.5 resize-y", error && "border-[var(--danger)]", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-xs font-medium uppercase tracking-wide text-foreground-muted mb-1.5", className)}
      {...props}
    />
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;

  return <p className="mt-1 text-xs text-[var(--danger)]">{children}</p>;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, error, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(fieldClasses, "appearance-none bg-no-repeat pr-8", error && "border-[var(--danger)]", className)}
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235c6072' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      backgroundPosition: "right 0.65rem center",
    }}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
