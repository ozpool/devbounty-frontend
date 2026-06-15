"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { useSessionStore } from "@/store/session";

export function useLogout() {
  const reset = useSessionStore((s) => s.reset);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
