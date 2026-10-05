import { Receipt } from "lucide-react";
import type { ReactNode } from "react";

export default function RequestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-background px-4 py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, var(--primary) 0%, transparent 35%), radial-gradient(circle at 85% 80%, var(--secondary) 0%, transparent 35%)",
          filter: "blur(80px)",
        }}
      />
      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-primary text-primary-foreground">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">AIO Invoice</p>
            <p className="text-xs text-foreground-faint leading-tight">AIO Technologies</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
