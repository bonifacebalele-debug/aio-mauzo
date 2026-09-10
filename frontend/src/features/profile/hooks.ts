import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProfileSignature,
  fetchProfile,
  updateProfile,
  updateProfilePassword,
  uploadProfileSignature,
} from "@/lib/api/profile";
import { useAuthStore } from "@/store/auth-store";

export function useProfile() {
  return useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(["profile"], user);
      setUser(user);
    },
  });
}

export function useUpdateProfilePassword() {
  return useMutation({ mutationFn: updateProfilePassword });
}

export function useUploadProfileSignature() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: uploadProfileSignature,
    onSuccess: (user) => {
      queryClient.setQueryData(["profile"], user);
      setUser(user);
    },
  });
}

export function useDeleteProfileSignature() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: deleteProfileSignature,
    onSuccess: (user) => {
      queryClient.setQueryData(["profile"], user);
      setUser(user);
    },
  });
}
