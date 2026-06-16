"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { bountiesApi } from "@/lib/api";
import type { BountyFilters } from "@/lib/types";

// Poll the live views so server-side changes (a merge, a payout) appear without
// a manual refresh. Detail polling stops once a bounty is done, to save requests.
const LIVE_REFETCH_MS = 12_000;
const TERMINAL_STATUSES = new Set(["paid", "refunded", "cancelled"]);

export function useBounties(filters: BountyFilters) {
  return useQuery({
    queryKey: ["bounties", filters],
    queryFn: () => bountiesApi.list(filters),
    placeholderData: keepPreviousData,
    refetchInterval: LIVE_REFETCH_MS,
    refetchOnWindowFocus: true,
  });
}

export function useBounty(bountyId: string) {
  return useQuery({
    queryKey: ["bounty", bountyId],
    queryFn: () => bountiesApi.get(bountyId),
    enabled: Boolean(bountyId),
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      const status = query.state.data?.lifecycleStatus;
      return status && TERMINAL_STATUSES.has(status) ? false : LIVE_REFETCH_MS;
    },
  });
}
