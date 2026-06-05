"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiError, authApi } from "@/lib/api";
import { useSessionStore } from "@/store/session";

/**
 * Hydrates the session store from the backend `/me`. A 401 means "not signed
 * in" (a normal state, not an error). Read session anywhere via useSessionStore.
 */
export function useSession() {
  const setMe = useSessionStore((s) => s.setMe);
  const setStatus = useSessionStore((s) => s.setStatus);

  const query = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await authApi.me();
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) return null;
        throw e;
      }
    },
    staleTime: 60_000,
  });

  React.useEffect(() => {
    if (query.isPending) setStatus("loading");
    else setMe(query.data ?? null);
  }, [query.isPending, query.data, setMe, setStatus]);

  return {
    me: useSessionStore((s) => s.me),
    status: useSessionStore((s) => s.status),
    isLoading: query.isPending,
  };
}
