"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Mail, Phone, Receipt, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { register as registerAccount } from "@/lib/api/auth";
import { extractErrorMessage } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import { FieldError, Input, Label } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { toast } from "@/store/toast-store";

const schema = z
  .object({
    name: z.string().min(1, "Name is required").max(255),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    phone: z.string().max(30).optional().or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await registerAccount(values);
      setSubmitted(true);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <GlassCard className="p-6 text-center sm:p-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--success-bg)] text-[var(--success)]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold">Request sent</h1>
          <p className="mt-2 text-sm text-foreground-muted">
            Thanks for registering. Your account is awaiting administrator approval — we&apos;ll email you once it has
            been reviewed.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground shadow-lg shadow-primary/30">
          <Receipt className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="mt-1 text-sm text-foreground-muted">Request access to AIO Invoice</p>
      </div>

      <GlassCard className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
              <Input id="name" className="pl-9" error={errors.name?.message} {...register("name")} />
            </div>
            <FieldError>{errors.name?.message}</FieldError>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
              <Input id="email" type="email" className="pl-9" error={errors.email?.message} {...register("email")} />
            </div>
            <FieldError>{errors.email?.message}</FieldError>
          </div>

          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
              <Input id="phone" className="pl-9" {...register("phone")} />
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <PasswordInput id="password" error={errors.password?.message} {...register("password")} />
            <FieldError>{errors.password?.message}</FieldError>
          </div>

          <div>
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <PasswordInput
              id="password_confirmation"
              error={errors.password_confirmation?.message}
              {...register("password_confirmation")}
            />
            <FieldError>{errors.password_confirmation?.message}</FieldError>
          </div>

          <Button type="submit" size="lg" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request access"}
          </Button>
        </form>
      </GlassCard>

      <p className="mt-6 text-center text-sm text-foreground-faint">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
