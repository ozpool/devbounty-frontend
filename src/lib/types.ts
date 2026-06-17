/** Shared DTO shapes, mirrored from the backend's zod output schemas. */

export type OnChainStatus = "None" | "Open" | "Paid" | "Refunded";

export type LifecycleStatus =
  | "pending_deposit"
  | "open"
  | "claimed"
  | "submitted"
  | "releasing"
  | "paid"
  | "refunded"
  | "release_failed";

export type ClaimStatus = "active" | "expired" | "submitted" | "paid" | "released";

export type Role = "hunter" | "maintainer";

export interface RepoRef {
  owner: string;
  name: string;
  fullName: string;
  githubRepoId: number;
}

export interface Bounty {
  bountyId: string;
  maintainerAddress: string;
  repo: RepoRef;
  issueNumber: number;
  issueTitle: string;
  issueUrl: string;
  amountUsdc: string;
  language: string;
  onChainStatus: OnChainStatus;
  lifecycleStatus: LifecycleStatus;
  refundWindowSnapshot: number;
  hunterAddress?: string;
  txCreate?: string | null;
  txRelease?: string | null;
  txRefund?: string | null;
  createdAt?: string;
}

export interface PublicClaim {
  hunterAddress: string;
  status: ClaimStatus;
  expiresAt?: string;
  prUrl?: string;
  prNumber?: number;
  createdAt?: string;
}

export interface BountyDetail extends Bounty {
  claims: PublicClaim[];
}

export interface Me {
  address: string;
  role: Role;
  githubLogin?: string;
  hasLinkedGithub: boolean;
}

export interface HunterLanguage {
  name: string;
  count: number;
}

export interface PayoutRecord {
  bountyId: string;
  amountUsdc: string;
  repoFullName: string;
  language?: string;
  txHash: string;
  createdAt?: string;
}

export interface HunterProfile {
  address: string;
  githubLogin?: string;
  totalEarnedUsdc: string;
  payoutCount: number;
  reposContributed: number;
  languages: HunterLanguage[];
  recentPayouts: PayoutRecord[];
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  githubLogin?: string;
  totalEarnedUsdc: string;
  payoutCount: number;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface CreateBountyBody {
  repoFullName: string;
  githubRepoId: number;
  issueNumber: number;
  issueTitle: string;
  issueUrl: string;
  amountUsdc: string;
  language: string;
}

export interface BountyFilters {
  status?: LifecycleStatus | "";
  language?: string;
  repo?: string;
  minAmount?: string;
  page?: number;
  pageSize?: number;
}
