import { apiFetch } from "./client";
import type {
  Bounty,
  BountyDetail,
  BountyFilters,
  CreateBountyBody,
  Paginated,
} from "@/lib/types";

export const bountiesApi = {
  /** Create the off-chain pending_deposit record; returns the derived bountyId. */
  create: (body: CreateBountyBody) =>
    apiFetch<{ bountyId: string; lifecycleStatus: string }>("/bounties", {
      method: "POST",
      body,
      headers: { "Idempotency-Key": crypto.randomUUID() },
    }),

  list: (filters: BountyFilters = {}) =>
    apiFetch<Paginated<Bounty>>("/bounties", {
      query: {
        status: filters.status,
        language: filters.language,
        repo: filters.repo,
        minAmount: filters.minAmount,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    }),

  get: (bountyId: string) => apiFetch<BountyDetail>(`/bounties/${bountyId}`),

  /** Maintainer abandons a bounty that was never funded. */
  cancel: (bountyId: string) =>
    apiFetch<{ bountyId: string; status: string }>(`/bounties/${bountyId}/cancel`, {
      method: "POST",
    }),

  claim: (bountyId: string) =>
    apiFetch<{ bountyId: string; expiresAt: string }>(`/bounties/${bountyId}/claim`, {
      method: "POST",
    }),

  releaseClaim: (bountyId: string) =>
    apiFetch<{ bountyId: string; status: string }>(`/bounties/${bountyId}/claim`, {
      method: "DELETE",
    }),

  // Returns the submitted claim, or `{ warning: "issue_mismatch" }` when the PR
  // is for a different issue than the bounty. Re-send with confirmMismatch: true
  // to proceed past that warning.
  submitPr: (bountyId: string, prUrl: string, confirmMismatch = false) =>
    apiFetch<{
      bountyId?: string;
      prUrl?: string;
      prNumber?: number;
      status?: string;
      warning?: "issue_mismatch";
      expectedIssue?: number;
    }>(`/bounties/${bountyId}/submit`, {
      method: "POST",
      body: { prUrl, confirmMismatch },
    }),

  refundEligibility: (bountyId: string) =>
    apiFetch<{ eligible: boolean; reason: string; windowExpiresAt?: string }>(
      `/bounties/${bountyId}/refund-eligibility`,
    ),

  refundRecorded: (bountyId: string, txHash: string) =>
    apiFetch<{ bountyId: string; status: string }>(
      `/bounties/${bountyId}/refund-recorded`,
      { method: "POST", body: { txHash } },
    ),

  /** Tell the backend the funding tx landed so the bounty leaves
   *  pending_deposit immediately (the indexer is still the canonical source). */
  depositRecorded: (bountyId: string, txHash: string) =>
    apiFetch<{ bountyId: string; status: string }>(
      `/bounties/${bountyId}/deposit-recorded`,
      { method: "POST", body: { txHash } },
    ),
};
