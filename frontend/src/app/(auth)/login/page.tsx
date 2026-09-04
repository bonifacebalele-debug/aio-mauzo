"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Lock, Mail, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "@/lib/api/auth";
import { extractErrorMessage } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/Card";
import { FieldError, Input, Label } from "@/components/ui/Input";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "@/store/toast-store";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const user = await login(values);
      setUser(user);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}.`);
      router.replace("/dashboard");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground shadow-lg shadow-primary/30">
          <Receipt className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">AIO Invoice</h1>
        <p className="mt-1 text-sm text-foreground-muted">Sign in to manage invoices for AIO Technologies</p>
      </div>

      <GlassCard className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@aio-mauzo.local"
                className="pl-9"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
            <FieldError>{errors.email?.message}</FieldError>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="pl-9"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>
            <FieldError>{errors.password?.message}</FieldError>
          </div>

          <Button type="submit" size="lg" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </Button>
        </form>
      </GlassCard>

      <p className="mt-6 text-center text-xs text-foreground-faint">
        Demo accounts: admin / manager / sales / accountant / viewer @aio-mauzo.local — password: password
      </p>
    </motion.div>
  );
}
