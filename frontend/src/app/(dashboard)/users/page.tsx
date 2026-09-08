"use client";

import { Plus, Search, UserCog } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { TableSkeleton } from "@/components/ui/Skeleton";
import { UserCard, UserTableRow } from "@/features/users/UserRow";
import { useDeleteUser, useUsers } from "@/features/users/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import type { User } from "@/lib/api/types";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);

  const currentUser = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canManage = hasPermission("users.manage");

  const { data, isLoading } = useUsers({ search: search || undefined, page, per_page: 15 });
  const deleteUser = useDeleteUser();

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

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage who can sign in to AIO Invoice and what they can do"
        actions={
          canManage && (
            <Link href="/users/new" className={buttonVariants({ className: "gap-2" })}>
              <Plus className="h-4 w-4" /> New User
            </Link>
          )
        }
      />

      <div className="mb-4">
        <div className="relative max-w-sm">
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
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
        {isLoading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : !data?.data.length ? (
          <EmptyState
            icon={UserCog}
            title="No users found"
            description={search ? "Try a different search term." : "Add your first user to get started."}
            action={
              canManage &&
              !search && (
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
                />
              ))}
            </div>

            <Pagination meta={data.meta} onPageChange={setPage} />
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
    </div>
  );
}
