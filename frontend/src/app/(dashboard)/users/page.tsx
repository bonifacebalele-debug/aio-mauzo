"use client";

import { Plus, Search, UserCog } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { ApproveUserDialog, RejectUserDialog } from "@/features/users/ApprovalDialogs";
import { UserCard, UserTableRow } from "@/features/users/UserRow";
import { useApproveUser, useDeleteUser, useRejectUser, useUsers } from "@/features/users/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import type { User, UserStatus } from "@/lib/api/types";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

const STATUS_OPTIONS: { value: UserStatus | ""; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending approval" },
  { value: "awaiting_verification", label: "Awaiting verification" },
  { value: "rejected", label: "Rejected" },
];

export default function UsersPage() {
  return (
    <Suspense fallback={null}>
      <UsersPageContent />
    </Suspense>
  );
}

function UsersPageContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<UserStatus | "">((searchParams.get("status") as UserStatus | null) ?? "");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [pendingApprove, setPendingApprove] = useState<User | null>(null);
  const [pendingReject, setPendingReject] = useState<User | null>(null);

  const currentUser = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canManage = hasPermission("users.manage");
  const canRequest = hasPermission("users.request");

  const { data, isLoading } = useUsers({
    search: search || undefined,
    status: status || undefined,
    page,
    per_page: perPage,
  });
  const deleteUser = useDeleteUser();
  const approveUser = useApproveUser();
  const rejectUser = useRejectUser();

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteUser.mutateAsync(pendingDelete.id);
      toast.success(`${pendingDelete.name} deleted.`);
      setPendingDelete(null);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleApprove = async (role?: string) => {
    if (!pendingApprove) return;
    try {
      await approveUser.mutateAsync({ id: pendingApprove.id, payload: { role } });
      toast.success(`${pendingApprove.name} approved — a verification email was sent.`);
      setPendingApprove(null);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleReject = async (reason?: string) => {
    if (!pendingReject) return;
    try {
      await rejectUser.mutateAsync({ id: pendingReject.id, payload: { reason } });
      toast.success(`${pendingReject.name} rejected.`);
      setPendingReject(null);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage who can sign in to AIO Invoice and what they can do"
        actions={
          (canManage || canRequest) && (
            <Link href="/users/new" className={buttonVariants({ className: "gap-2" })}>
              <Plus className="h-4 w-4" /> New User
            </Link>
          )
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
          <Input
            placeholder="Search by name or email…"
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          className="sm:w-56"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as UserStatus | "");
            setPage(1);
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        {isLoading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : !data?.data.length ? (
          <EmptyState
            icon={UserCog}
            title="No users found"
            description={search || status ? "Try a different search or filter." : "Add your first user to get started."}
            action={
              (canManage || canRequest) &&
              !search &&
              !status && (
                <Link href="/users/new" className={buttonVariants({ size: "sm", className: "gap-2" })}>
                  <Plus className="h-4 w-4" /> New User
                </Link>
              )
            }
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-foreground-faint">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      canManage={canManage}
                      isSelf={currentUser?.id === user.id}
                      onDelete={setPendingDelete}
                      onApprove={setPendingApprove}
                      onReject={setPendingReject}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 sm:hidden">
              {data.data.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  canManage={canManage}
                  isSelf={currentUser?.id === user.id}
                  onDelete={setPendingDelete}
                  onApprove={setPendingApprove}
                  onReject={setPendingReject}
                />
              ))}
            </div>

            <Pagination
              meta={data.meta}
              onPageChange={setPage}
              onPerPageChange={(value) => {
                setPerPage(value);
                setPage(1);
              }}
            />
          </>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete user"
        description={`This will permanently remove "${pendingDelete?.name}" and revoke their access.`}
        loading={deleteUser.isPending}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <ApproveUserDialog
        user={pendingApprove}
        loading={approveUser.isPending}
        onConfirm={handleApprove}
        onCancel={() => setPendingApprove(null)}
      />

      <RejectUserDialog
        user={pendingReject}
        loading={rejectUser.isPending}
        onConfirm={handleReject}
        onCancel={() => setPendingReject(null)}
      />
    </div>
  );
}
