"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Receipt } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { verifyAccount } from "@/lib/api/auth";
import { extractErrorMessage } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import { FieldError, Label } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
    password_confirmation: z.string().optional().or(z.literal("")),
  })
  .refine((data) => !data.password || data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof schema>;

function VerifyAccountContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const expires = searchParams.get("expires");
  const token = searchParams.get("token");

  const [state, setState] = useState<"form" | "success">("form");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const missingParams = !uid || !expires || !token;

  const onSubmit = async (values: FormValues) => {
    if (!uid || !expires || !token) return;

    setServerMessage(null);
    try {
      const res = await verifyAccount({
        uid: Number(uid),
        expires: Number(expires),
        token,
        password: values.password || undefined,
        password_confirmation: values.password_confirmation || undefined,
      });
      setServerMessage(res.message);
      setState("success");
    } catch (error) {
      setServerMessage(extractErrorMessage(error));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground shadow-lg shadow-primary/30">
          <Receipt className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Verify your account</h1>
      </div>

      <GlassCard className="p-6 sm:p-8">
        {missingParams ? (
          <div className="text-center">
            <AlertCircle className="mx-auto mb-3 h-6 w-6 text-[var(--danger)]" />
            <p className="text-sm text-foreground-muted">
              This verification link looks incomplete. Copy the full link from your email, or ask an administrator to
              resend it.
            </p>
          </div>
        ) : state === "success" ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto mb-3 h-6 w-6 text-[var(--success)]" />
            <p className="text-sm text-foreground-muted">{serverMessage}</p>
            <Link href="/login" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
              Go to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-foreground-muted">
              If you were invited by a manager, choose a password below to activate your account. If you already have
              a password, just click Verify.
            </p>

            <div>
              <Label htmlFor="password">Password</Label>
              <PasswordInput id="password" placeholder="Leave blank if you already have one" error={errors.password?.message} {...register("password")} />
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

            {serverMessage && <p className="text-sm text-[var(--danger)]">{serverMessage}</p>}

            <Button type="submit" size="lg" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify My Account"}
            </Button>
          </form>
        )}
      </GlassCard>
    </motion.div>
  );
}

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={null}>
      <VerifyAccountContent />
    </Suspense>
  );
}
