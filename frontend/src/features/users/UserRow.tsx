"use client";

import { Check, Trash2, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/StatusPill";
import type { User } from "@/lib/api/types";
import { cn } from "@/lib/utils/cn";

interface UserRowProps {
  user: User;
  onDelete: (user: User) => void;
  onApprove?: (user: User) => void;
  onReject?: (user: User) => void;
  canManage: boolean;
  isSelf: boolean;
}

const STATUS_STYLES: Record<User["status"], string> = {
  active: "bg-[var(--success-bg)] text-[var(--success)]",
  pending: "bg-[var(--warning-bg)] text-[var(--warning)]",
  awaiting_verification: "bg-[var(--info-bg)] text-[var(--info)]",
  rejected: "bg-[var(--danger-bg)] text-[var(--danger)]",
};

const STATUS_LABELS: Record<User["status"], string> = {
  active: "Active",
  pending: "Pending approval",
  awaiting_verification: "Awaiting verification",
  rejected: "Rejected",
};

function statusLabel(user: User): string {
  if (user.status === "active" && !user.is_active) return "Inactive";

  return STATUS_LABELS[user.status];
}

function statusClasses(user: User): string {
  if (user.status === "active" && !user.is_active) return "bg-[var(--danger-bg)] text-[var(--danger)]";

  return STATUS_STYLES[user.status];
}

function StatusBadge({ user }: { user: User }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", statusClasses(user))}>
      {statusLabel(user)}
    </span>
  );
}

function ApprovalActions({
  user,
  onApprove,
  onReject,
}: {
  user: User;
  onApprove?: (user: User) => void;
  onReject?: (user: User) => void;
}) {
  if (user.status !== "pending" || !onApprove || !onReject) return null;

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        onClick={() => onApprove(user)}
        className="rounded-[var(--radius-sm)] p-2 text-foreground-faint transition-colors hover:bg-[var(--success-bg)] hover:text-[var(--success)]"
        aria-label="Approve user"
        title="Approve"
      >
        <Check className="h-4 w-4" />
      </button>
      <button
        onClick={() => onReject(user)}
        className="rounded-[var(--radius-sm)] p-2 text-foreground-faint transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
        aria-label="Reject user"
        title="Reject"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function UserTableRow({ user, onDelete, onApprove, onReject, canManage, isSelf }: UserRowProps) {
  const clickable = canManage && user.status === "active";

  return (
    <tr className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--neutral-bg)]/60">
      <td className="px-4 py-3">
        <Link
          href={clickable ? `/users/${user.id}/edit` : "#"}
          className={cn("font-medium text-foreground", clickable && "hover:text-primary")}
        >
          {user.name}
          {isSelf && <span className="ml-1.5 text-xs font-normal text-foreground-faint">(you)</span>}
        </Link>
        <p className="text-xs text-foreground-faint">{user.email}</p>
        {user.status === "rejected" && user.rejection_reason && (
          <p className="mt-0.5 text-xs text-[var(--danger)]">{user.rejection_reason}</p>
        )}
      </td>
      <td className="px-4 py-3">
        <Badge>{user.roles[0] ?? "—"}</Badge>
      </td>
      <td className="px-4 py-3 text-sm text-foreground-muted">{user.phone ?? "—"}</td>
      <td className="px-4 py-3">
        <StatusBadge user={user} />
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <ApprovalActions user={user} onApprove={canManage ? onApprove : undefined} onReject={canManage ? onReject : undefined} />
          {canManage && !isSelf && user.status !== "pending" && (
            <button
              onClick={() => onDelete(user)}
              className="rounded-[var(--radius-sm)] p-2 text-foreground-faint transition-colors hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
              aria-label="Delete user"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function UserCard({ user, onDelete, onApprove, onReject, canManage, isSelf }: UserRowProps) {
  const clickable = canManage && user.status === "active";

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start justify-between gap-2">
        <Link href={clickable ? `/users/${user.id}/edit` : "#"} className="min-w-0">
          <p className="truncate font-medium">
            {user.name}
            {isSelf && <span className="ml-1.5 text-xs font-normal text-foreground-faint">(you)</span>}
          </p>
          <p className="truncate text-xs text-foreground-faint">{user.email}</p>
        </Link>
        {canManage && !isSelf && user.status !== "pending" && (
          <button
            onClick={() => onDelete(user)}
            className="shrink-0 rounded-[var(--radius-sm)] p-2 text-foreground-faint hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
            aria-label="Delete user"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      {user.status === "rejected" && user.rejection_reason && (
        <p className="mt-1 text-xs text-[var(--danger)]">{user.rejection_reason}</p>
      )}
      <div className="mt-3 flex items-center gap-2">
        <Badge>{user.roles[0] ?? "—"}</Badge>
        <StatusBadge user={user} />
      </div>
      {canManage && (
        <div className="mt-3">
          <ApprovalActions user={user} onApprove={onApprove} onReject={onReject} />
        </div>
      )}
    </div>
  );
}
