"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { fetchCurrentUser } from "@/lib/api/auth";
import { registerUnauthorizedHandler } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setUser(null);
      router.push("/login");
    });
  }, [router, setUser]);

  useEffect(() => {
    setStatus("loading");
    fetchCurrentUser()
      .then((user) => setUser(user))
      .catch(() => setUser(null));
  }, [setStatus, setUser]);

  return <>{children}</>;
}
