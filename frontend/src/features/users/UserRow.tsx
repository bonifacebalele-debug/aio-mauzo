"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/StatusPill";
import type { User } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";

interface UserRowProps {
  user: User;
  onDelete: (user: User) => void;
  canManage: boolean;
  isSelf: boolean;
}

export function UserTableRow({ user, onDelete, canManage, isSelf }: UserRowProps) {
  return (
    <tr className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--neutral-bg)]/60">
      <td className="px-4 py-3">
        <Link
          href={canManage ? `/users/${user.id}/edit` : "#"}
          className={cn("font-medium text-foreground", canManage && "hover:text-primary")}
        >
          {user.name}
          {isSelf && <span className="ml-1.5 text-xs font-normal text-foreground-faint">(you)</span>}
        </Link>
        <p className="text-xs text-foreground-faint">{user.email}</p>
      </td>
      <td className="px-4 py-3">
        <Badge>{user.roles[0] ?? "—"}</Badge>
      </td>
      <td className="px-4 py-3 text-sm text-foreground-muted">{user.phone ?? "—"}</td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
            user.is_active ? "bg-[var(--success-bg)] text-[var(--success)]" : "bg-[var(--danger-bg)] text-[var(--danger)]",
          )}
        >
          {user.is_active ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        {canManage && !isSelf && (
          <button
            onClick={() => onDelete(user)}
            className="rounded-[var(--radius-sm)] p-2 text-foreground-faint transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
            aria-label="Delete user"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </td>
    </tr>
  );
}

export function UserCard({ user, onDelete, canManage, isSelf }: UserRowProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-2">
        <Link href={canManage ? `/users/${user.id}/edit` : "#"} className="min-w-0">
          <p className="truncate font-medium">
            {user.name}
            {isSelf && <span className="ml-1.5 text-xs font-normal text-foreground-faint">(you)</span>}
          </p>
          <p className="truncate text-xs text-foreground-faint">{user.email}</p>
        </Link>
        {canManage && !isSelf && (
          <button
            onClick={() => onDelete(user)}
            className="shrink-0 rounded-[var(--radius-sm)] p-2 text-foreground-faint hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
            aria-label="Delete user"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Badge>{user.roles[0] ?? "—"}</Badge>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
            user.is_active ? "bg-[var(--success-bg)] text-[var(--success)]" : "bg-[var(--danger-bg)] text-[var(--danger)]",
          )}
        >
          {user.is_active ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}
