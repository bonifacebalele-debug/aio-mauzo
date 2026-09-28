"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { RequestUserForm, type RequestUserFormValues } from "@/features/users/RequestUserForm";
import { UserForm, type UserFormValues } from "@/features/users/UserForm";
import { useCreateUser, useRequestCreateUser } from "@/features/users/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

export default function NewUserPage() {
  const router = useRouter();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const canManage = hasPermission("users.manage");
  const canRequest = hasPermission("users.request");

  const createUser = useCreateUser();
  const requestCreateUser = useRequestCreateUser();

  const handleCreate = async (values: UserFormValues) => {
    try {
      const user = await createUser.mutateAsync(values);
      toast.success(`${user.name} created.`);
      router.push("/users");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleRequest = async (values: RequestUserFormValues) => {
    try {
      const user = await requestCreateUser.mutateAsync(values);
      toast.success(`Sent for approval — ${user.name} will be notified once an administrator reviews it.`);
      router.push("/users");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  // Administrator gets the full instant-create flow; Manager gets the
  // restricted "submit for approval" flow. Neither permission (shouldn't
  // normally be reachable — the nav/button are gated too) falls back to
  // nothing rather than guessing.
  return (
    <div>
      <PageHeader
        title="New User"
        description={
          canManage
            ? "Give someone access to AIO Invoice"
            : "Submit a new user for administrator approval"
        }
      />
      <Card className="max-w-3xl">
        <CardContent>
          {canManage ? (
            <UserForm onSubmit={handleCreate} submitLabel="Create user" mode="create" />
          ) : canRequest ? (
            <RequestUserForm onSubmit={handleRequest} />
          ) : (
            <p className="text-sm text-foreground-muted">You don&apos;t have permission to add users.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
