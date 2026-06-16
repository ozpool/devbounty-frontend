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

  submitPr: (bountyId: string, prUrl: string) =>
    apiFetch<{ bountyId: string; prUrl: string; prNumber: number }>(
      `/bounties/${bountyId}/submit`,
      { method: "POST", body: { prUrl } },
    ),

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
