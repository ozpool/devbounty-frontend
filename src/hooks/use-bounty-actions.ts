"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bountiesApi } from "@/lib/api";

/** Claim / release / submit mutations that refresh the bounty detail on success. */
export function useBountyActions(bountyId: string) {
  const qc = useQueryClient();
  // Refresh the bounty, the board, and the viewer's identity/claims so a claim
  // or submission shows everywhere at once without a manual refresh.
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["bounty", bountyId] });
    qc.invalidateQueries({ queryKey: ["bounties"] });
    qc.invalidateQueries({ queryKey: ["me"] });
  };

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
