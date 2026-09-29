"use client";

import { Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  {
    label: "Smileys",
    emojis: [
      "😀", "😂", "😅", "😊", "🙂", "😉", "😍", "😘", "😜", "🤔",
      "😎", "😴", "😭", "😡", "🥳", "😇", "🙃", "😬", "🤗", "😢",
    ],
  },
  {
    label: "Gestures",
    emojis: ["👍", "👎", "👏", "🙏", "🙌", "👌", "✌️", "🤝", "💪", "👋", "🤞", "✋"],
  },
  {
    label: "Symbols",
    emojis: ["❤️", "🔥", "💯", "✅", "❌", "⭐", "🎉", "💡", "⚡", "💰", "📌", "❗"],
  },
  {
    label: "Work",
    emojis: ["📅", "📈", "📉", "📝", "📧", "💼", "⏰", "☕", "🚀", "📎", "🧾", "✔️"],
  },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Add emoji"
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-foreground-muted transition-colors hover:bg-[var(--neutral-bg)] hover:text-foreground",
          open && "bg-[var(--neutral-bg)] text-foreground",
        )}
      >
        <Smile className="h-4.5 w-4.5" />
      </button>

      {open && (
        <div className="absolute bottom-full right-0 z-50 mb-2 max-h-72 w-64 overflow-y-auto rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xl">
          {EMOJI_GROUPS.map((group) => (
            <div key={group.label} className="mb-2 last:mb-0">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-foreground-faint">
                {group.label}
              </p>
              <div className="grid grid-cols-8 gap-0.5">
                {group.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      onSelect(emoji);
                      setOpen(false);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded text-lg transition-colors hover:bg-[var(--neutral-bg)]"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
