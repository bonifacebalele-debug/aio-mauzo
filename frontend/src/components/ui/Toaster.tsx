"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { useToastStore } from "@/store/toast-store";

const icons = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const colors = {
  success: "text-[var(--success)]",
  error: "text-[var(--danger)]",
  info: "text-[var(--info)]",
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.variant];

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => dismiss(t.id)}
              className="glass-card flex max-w-sm cursor-pointer items-start gap-2.5 rounded-[var(--radius-md)] px-4 py-3 text-sm"
            >
              <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${colors[t.variant]}`} />
              <span className="text-foreground">{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
