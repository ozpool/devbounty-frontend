"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bountiesApi } from "@/lib/api";

/** Claim / release / submit mutations that refresh the bounty detail on success. */
export function useBountyActions(bountyId: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["bounty", bountyId] });

  const claim = useMutation({
    mutationFn: () => bountiesApi.claim(bountyId),
    onSuccess: invalidate,
  });
  const releaseClaim = useMutation({
    mutationFn: () => bountiesApi.releaseClaim(bountyId),
    onSuccess: invalidate,
  });
  const submitPr = useMutation({
    mutationFn: (prUrl: string) => bountiesApi.submitPr(bountyId, prUrl),
    onSuccess: invalidate,
  });

  return { claim, releaseClaim, submitPr };
}
