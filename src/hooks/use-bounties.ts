"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { bountiesApi } from "@/lib/api";
import type { BountyFilters } from "@/lib/types";

export function useBounties(filters: BountyFilters) {
  return useQuery({
    queryKey: ["bounties", filters],
    queryFn: () => bountiesApi.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useBounty(bountyId: string) {
  return useQuery({
    queryKey: ["bounty", bountyId],
    queryFn: () => bountiesApi.get(bountyId),
    enabled: Boolean(bountyId),
  });
}
