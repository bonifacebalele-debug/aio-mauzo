"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { UserForm, type UserFormValues } from "@/features/users/UserForm";
import { useCreateUser } from "@/features/users/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { toast } from "@/store/toast-store";

export default function NewUserPage() {
  const router = useRouter();
  const createUser = useCreateUser();

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const user = await createUser.mutateAsync(values);
      toast.success(`${user.name} created.`);
      router.push("/users");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div>
      <PageHeader title="New User" description="Give someone access to AIO Invoice" />
      <Card className="max-w-3xl">
        <CardContent>
          <UserForm onSubmit={handleSubmit} submitLabel="Create user" mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
