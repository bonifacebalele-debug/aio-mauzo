import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRoles } from "@/lib/api/reference";
import {
  createUser,
  deleteUser,
  fetchUser,
  fetchUsers,
  updateUser,
  type UserFilters,
} from "@/lib/api/users";
import type { UserPayload } from "@/lib/api/types";

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => fetchUsers(filters),
    placeholderData: (prev) => prev,
  });
}

export function useUser(id: number | undefined) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => fetchUser(id as number),
    enabled: id !== undefined,
  });
}

export function useRoles() {
  return useQuery({ queryKey: ["roles"], queryFn: fetchRoles, staleTime: 5 * 60_000 });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserPayload) => createUser(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<UserPayload>) => updateUser(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
}
