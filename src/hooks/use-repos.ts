"use client";

import { useQuery } from "@tanstack/react-query";
import { reposApi } from "@/lib/api";

export function useRepos(enabled: boolean) {
  return useQuery({
    queryKey: ["repos"],
    queryFn: () => reposApi.list(),
    enabled,
    retry: 0,
  });
}
