"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { fetchCurrentUser } from "@/lib/api/auth";
import { registerUnauthorizedHandler } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth-store";

// Pages that are meant to be visited while signed out. A 401 from
// GET /api/user on one of these is expected (the visitor isn't logged in
// yet) and must NOT bounce them away — that was cutting people off from
// /verify-account and /register before they could finish the form.
const PUBLIC_PATHS = ["/login", "/register", "/verify-account", "/request"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setUser(null);
      // Read the path at the moment the 401 actually arrives (not a
      // stale closure) so this stays correct even if the request was
      // in flight during a route change.
      if (typeof window !== "undefined" && isPublicPath(window.location.pathname)) {
        return;
      }
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
