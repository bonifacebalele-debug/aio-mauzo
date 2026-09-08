"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { UserForm, type UserFormValues } from "@/features/users/UserForm";
import { useUpdateUser, useUser } from "@/features/users/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const userId = Number(id);
  const router = useRouter();

  const currentUser = useAuthStore((s) => s.user);
  const isSelf = currentUser?.id === userId;

  const { data: user, isLoading } = useUser(userId);
  const updateUser = useUpdateUser(userId);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const payload = { ...values };
      if (!payload.password) {
        delete payload.password;
      }

      const updated = await updateUser.mutateAsync(payload);
      toast.success(`${updated.name} updated.`);
      router.push("/users");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-foreground-faint" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Edit User" description={user.name} />
      <Card className="max-w-3xl">
        <CardContent>
          <UserForm defaultValues={user} onSubmit={handleSubmit} submitLabel="Save changes" mode="edit" isSelf={isSelf} />
        </CardContent>
      </Card>
    </div>
  );
}
