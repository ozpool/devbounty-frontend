"use client";

import { useQuery } from "@tanstack/react-query";
import { reputationApi } from "@/lib/api";

export function useLeaderboard(lang: string, window: "30d" | "all") {
  return useQuery({
    queryKey: ["leaderboard", lang, window],
    queryFn: () => reputationApi.leaderboard(lang || undefined, window),
  });
}

export function useHunter(address: string) {
  return useQuery({
    queryKey: ["hunter", address],
    queryFn: () => reputationApi.hunter(address),
    enabled: Boolean(address),
  });
}
