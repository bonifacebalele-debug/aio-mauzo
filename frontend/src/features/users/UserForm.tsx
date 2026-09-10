"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Select } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import type { User } from "@/lib/api/types";
import { useRoles } from "./hooks";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Enter a valid email").max(255),
  phone: z.string().max(30).optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  role: z.string().min(1, "Select a role"),
  is_active: z.boolean(),
});

export type UserFormValues = z.infer<typeof schema>;

interface UserFormProps {
  defaultValues?: Partial<User>;
  onSubmit: (values: UserFormValues) => Promise<void>;
  submitLabel?: string;
  mode?: "create" | "edit";
  isSelf?: boolean;
}

export function UserForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save user",
  mode = "create",
  isSelf = false,
}: UserFormProps) {
  const { data: roles, isLoading: rolesLoading } = useRoles();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      password: "",
      role: defaultValues?.roles?.[0] ?? "",
      is_active: defaultValues?.is_active ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <div className="sm:col-span-2">
          <Label htmlFor="password">{mode === "edit" ? "New Password" : "Password"}</Label>
          <PasswordInput
            id="password"
            required={mode === "create"}
            error={errors.password?.message}
            {...register("password")}
          />
          {mode === "edit" && (
            <p className="mt-1 text-xs text-foreground-faint">Leave blank to keep the current password.</p>
          )}
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        {mode === "edit" && !isSelf && (
          <div className="sm:col-span-2 flex items-center gap-2">
            <input
              id="is_active"
              type="checkbox"
              className="h-4 w-4 rounded border-[var(--border)] accent-[var(--color-primary)]"
              {...register("is_active")}
            />
            <Label htmlFor="is_active" className="mb-0 normal-case tracking-normal">
              Active — user can sign in
            </Label>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
