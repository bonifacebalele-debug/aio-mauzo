import { create } from "zustand";
import type { User } from "@/lib/api/types";

interface AuthState {
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  setUser: (user: User | null) => void;
  setStatus: (status: AuthState["status"]) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  status: "idle",
  setUser: (user) => set({ user, status: user ? "authenticated" : "unauthenticated" }),
  setStatus: (status) => set({ status }),
  hasPermission: (permission) => get().user?.permissions.includes(permission) ?? false,
  hasRole: (role) => get().user?.roles.includes(role) ?? false,
}));
