"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Select } from "@/components/ui/Input";
import { useAssignableRoles } from "./hooks";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Enter a valid email").max(255),
  phone: z.string().max(30).optional().or(z.literal("")),
  role: z.string().min(1, "Select a role"),
});

export type RequestUserFormValues = z.infer<typeof schema>;

interface RequestUserFormProps {
  onSubmit: (values: RequestUserFormValues) => Promise<void>;
}

/**
 * A Manager's restricted "create user" flow: no password field (the
 * invited person sets their own via the verification email after an
 * administrator approves), and the role list only offers roles a Manager
 * is allowed to grant — never Administrator or Manager itself.
 */
export function RequestUserForm({ onSubmit }: RequestUserFormProps) {
  const { data: roles, isLoading: rolesLoading } = useAssignableRoles();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestUserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", role: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <p className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--neutral-bg)] px-3.5 py-2.5 text-sm text-foreground-muted">
        This sends the request to an administrator for approval. Once approved, the new user gets an email to set
        their own password and verify their account — you don&apos;t set a password for them.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" error={errors.name?.message} {...register("name")} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" error={errors.email?.message} {...register("email")} />
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} />
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Select id="role" error={errors.role?.message} disabled={rolesLoading} {...register("role")}>
            <option value="">Select role</option>
            {roles?.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
          <FieldError>{errors.role?.message}</FieldError>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send for approval
        </Button>
      </div>
    </form>
  );
}
