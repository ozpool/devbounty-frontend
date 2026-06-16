import { apiFetch } from "./client";
import type { HunterProfile, LeaderboardEntry } from "@/lib/types";

export const reputationApi = {
  leaderboard: (lang?: string, window: "30d" | "all" = "all") =>
    apiFetch<{ items: LeaderboardEntry[]; window: string; lang?: string }>(
      "/leaderboard",
      { query: { lang, window } },
    ),

  hunter: (address: string) => apiFetch<HunterProfile>(`/hunters/${address}`),
};
