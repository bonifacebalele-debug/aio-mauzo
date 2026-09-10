"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Trash2, Upload } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FieldError, Input, Label } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import {
  useDeleteProfileSignature,
  useProfile,
  useUpdateProfile,
  useUpdateProfilePassword,
  useUploadProfileSignature,
} from "@/features/profile/hooks";
import { extractErrorMessage } from "@/lib/api/client";
import { toast } from "@/store/toast-store";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Enter a valid email").max(255),
  phone: z.string().max(30).optional().or(z.literal("")),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
type PasswordFormValues = z.infer<typeof passwordSchema>;

function AccountDetailsCard() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: profile ? { name: profile.name, email: profile.email, phone: profile.phone ?? "" } : undefined,
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile.mutateAsync(values);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  if (isLoading || !profile) {
    return (
      <Card>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-foreground-faint" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <Label>Role</Label>
              <p className="mt-2 text-sm text-foreground-muted">{profile.roles.join(", ") || "—"}</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ChangePasswordCard() {
  const updatePassword = useUpdateProfilePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (values: PasswordFormValues) => {
    try {
      await updatePassword.mutateAsync(values);
      toast.success("Password updated.");
      reset();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="current_password">Current Password</Label>
            <PasswordInput
              id="current_password"
              error={errors.current_password?.message}
              {...register("current_password")}
            />
            <FieldError>{errors.current_password?.message}</FieldError>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="password">New Password</Label>
              <PasswordInput id="password" error={errors.password?.message} {...register("password")} />
              <FieldError>{errors.password?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="password_confirmation">Confirm New Password</Label>
              <PasswordInput
                id="password_confirmation"
                error={errors.password_confirmation?.message}
                {...register("password_confirmation")}
              />
              <FieldError>{errors.password_confirmation?.message}</FieldError>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Update password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function MySignatureCard() {
  const { data: profile } = useProfile();
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadProfileSignature();
  const remove = useDeleteProfileSignature();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await upload.mutateAsync(file);
      toast.success("Signature updated.");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      e.target.value = "";
    }
  };

  const handleRemove = async () => {
    try {
      await remove.mutateAsync();
      toast.success("Signature removed.");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const busy = upload.isPending || remove.isPending;
  const signatureUrl = profile?.signature_url ?? null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Signature</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-foreground-muted">
          Upload a transparent PNG of your own signature. Invoices you generate will show this signature instead of
          the company default. This only affects the in-app print preview — the downloaded/emailed PDF always uses
          the company signature, since the PDF provider does not support per-user signatures.
        </p>

        <div className="flex items-start gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-dashed border-[var(--border-strong)] bg-[var(--neutral-bg)]">
            {signatureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- externally-hosted, dynamically-uploaded asset
              <img src={signatureUrl} alt="My signature" className="h-full w-full object-contain p-2" />
            ) : (
              <Upload className="h-6 w-6 text-foreground-faint" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              {upload.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {signatureUrl ? "Replace" : "Upload"}
            </Button>
            {signatureUrl && (
              <Button type="button" variant="ghost" size="sm" disabled={busy} onClick={handleRemove}>
                {remove.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Remove
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  return (
    <div>
      <PageHeader title="My Profile" description="Manage your own account details, password, and signature" />
      <div className="max-w-3xl space-y-6">
        <AccountDetailsCard />
        <ChangePasswordCard />
        <MySignatureCard />
      </div>
    </div>
  );
}
