import type {
  Bounty,
  BountyDetail,
  HunterProfile,
  LeaderboardEntry,
  Me,
  Paginated,
} from "@/lib/types";
import type { GithubRepo } from "@/lib/api/repos";

// Seeded, deterministic dummy data for demo mode. Lets the whole app render
// (board, detail, leaderboard, profiles, dashboards) with no backend running.

const A = {
  maint: "0x4ffe7a9b21d6c0aa0d1b8f3e2c5a7d90e1f23456",
  hunter1: "0xa1b2c3d4e5f60718293a4b5c6d7e8f9001122334",
  hunter2: "0x9f8e7d6c5b4a39281706f5e4d3c2b1a098765432",
  hunter3: "0x0011223344556677889900aabbccddeeff001122",
  demo: "0xDEMo00000000000000000000000000000000d3m0",
} as const;

interface Seed {
  id: string;
  repo: string;
  repoId: number;
  issue: number;
  title: string;
  amount: string;
  lang: string;
  status: Bounty["lifecycleStatus"];
  age: string;
}

const SEEDS: Seed[] = [
  {
    id: "0xb01",
    repo: "octo/payments-sdk",
    repoId: 5001,
    issue: 482,
    title: "Race condition in webhook signature verification",
    amount: "1200",
    lang: "TypeScript",
    status: "open",
    age: "2026-05-29T10:00:00Z",
  },
  {
    id: "0xb02",
    repo: "vault-labs/escrow",
    repoId: 5002,
    issue: 91,
    title: "Reentrancy guard missing on emergency withdraw",
    amount: "3500",
    lang: "Solidity",
    status: "open",
    age: "2026-05-30T14:30:00Z",
  },
  {
    id: "0xb03",
    repo: "nimbus/api-gateway",
    repoId: 5003,
    issue: 1203,
    title: "JWT refresh token not rotated on reuse",
    amount: "800",
    lang: "Go",
    status: "claimed",
    age: "2026-05-28T08:15:00Z",
  },
  {
    id: "0xb04",
    repo: "pixel/forge-ui",
    repoId: 5004,
    issue: 77,
    title: "Focus trap escapes modal on shift+tab",
    amount: "450",
    lang: "TypeScript",
    status: "submitted",
    age: "2026-05-27T19:45:00Z",
  },
  {
    id: "0xb05",
    repo: "rustacean/serde-fast",
    repoId: 5005,
    issue: 334,
    title: "Integer overflow in varint decoder",
    amount: "2100",
    lang: "Rust",
    status: "open",
    age: "2026-05-31T06:20:00Z",
  },
  {
    id: "0xb06",
    repo: "datapeak/etl-core",
    repoId: 5006,
    issue: 56,
    title: "Memory leak in stream backpressure handler",
    amount: "1750",
    lang: "Python",
    status: "open",
    age: "2026-05-26T11:00:00Z",
  },
  {
    id: "0xb07",
    repo: "octo/payments-sdk",
    repoId: 5001,
    issue: 503,
    title: "Timing attack on HMAC comparison",
    amount: "2600",
    lang: "TypeScript",
    status: "paid",
    age: "2026-05-20T09:00:00Z",
  },
  {
    id: "0xb08",
    repo: "mesh/grpc-router",
    repoId: 5008,
    issue: 212,
    title: "Deadlock under concurrent stream cancel",
    amount: "1900",
    lang: "Go",
    status: "open",
    age: "2026-05-31T12:00:00Z",
  },
  {
    id: "0xb09",
    repo: "vault-labs/escrow",
    repoId: 5002,
    issue: 102,
    title: "Refund window off-by-one at boundary",
    amount: "1400",
    lang: "Solidity",
    status: "refunded",
    age: "2026-05-18T16:00:00Z",
  },
  {
    id: "0xb10",
    repo: "pixel/forge-ui",
    repoId: 5004,
    issue: 88,
    title: "Color contrast fails AA on muted text",
    amount: "600",
    lang: "JavaScript",
    status: "open",
    age: "2026-05-30T22:10:00Z",
  },
  {
    id: "0xb11",
    repo: "nimbus/api-gateway",
    repoId: 5003,
    issue: 1240,
    title: "Path traversal via encoded slash in proxy",
    amount: "3200",
    lang: "Go",
    status: "open",
    age: "2026-05-31T03:30:00Z",
  },
  {
    id: "0xb12",
    repo: "datapeak/etl-core",
    repoId: 5006,
    issue: 71,
    title: "SQL injection in dynamic filter builder",
    amount: "2800",
    lang: "Python",
    status: "claimed",
    age: "2026-05-29T17:25:00Z",
  },
];

function toBounty(s: Seed): Bounty {
  const [owner, name] = s.repo.split("/");
  return {
    bountyId: s.id,
    maintainerAddress: A.maint,
    repo: { owner, name, fullName: s.repo, githubRepoId: s.repoId },
    issueNumber: s.issue,
    issueTitle: s.title,
    issueUrl: `https://github.com/${s.repo}/issues/${s.issue}`,
    amountUsdc: s.amount,
    language: s.lang,
    onChainStatus:
      s.status === "paid" ? "Paid" : s.status === "refunded" ? "Refunded" : "Open",
    lifecycleStatus: s.status,
    refundWindowSnapshot: 1_209_600,
    createdAt: s.age,
  };
}

export const demoBounties: Bounty[] = SEEDS.map(toBounty);

export function demoBountyList(query: Record<string, string>): Paginated<Bounty> {
  let items = [...demoBounties];
  if (query.status) items = items.filter((b) => b.lifecycleStatus === query.status);
  if (query.language) items = items.filter((b) => b.language === query.language);
  if (query.repo)
    items = items.filter((b) =>
      b.repo.fullName.toLowerCase().includes(query.repo.toLowerCase()),
    );
  if (query.minAmount)
    items = items.filter((b) => Number(b.amountUsdc) >= Number(query.minAmount));
  const page = Number(query.page || 1);
  const pageSize = Number(query.pageSize || 12);
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, pageSize, total };
}

export function demoBountyDetail(id: string): BountyDetail | undefined {
  const b = demoBounties.find((x) => x.bountyId === id);
  if (!b) return undefined;
  const claims =
    b.lifecycleStatus === "claimed"
      ? [
          {
            hunterAddress: A.hunter1,
            status: "active" as const,
            createdAt: "2026-05-30T10:00:00Z",
          },
        ]
      : b.lifecycleStatus === "submitted"
        ? [
            {
              hunterAddress: A.hunter2,
              status: "submitted" as const,
              prUrl: `${b.issueUrl.replace("issues", "pull")}1`,
              prNumber: 510,
              createdAt: "2026-05-28T10:00:00Z",
            },
          ]
        : b.lifecycleStatus === "paid"
          ? [
              {
                hunterAddress: A.hunter1,
                status: "paid" as const,
                prUrl: `${b.issueUrl.replace("issues", "pull")}2`,
                prNumber: 511,
              },
            ]
          : [];
  return { ...b, claims };
}

const LEADERS: [string, string, string, number][] = [
  [A.hunter1, "satoshina", "18400", 12],
  [A.hunter2, "0xgremlin", "15200", 9],
  [A.hunter3, "merkletree", "11800", 8],
  [A.maint, "vitaliky", "9300", 6],
  [A.demo, "you-the-demo", "5400", 4],
];

export function demoLeaderboard(): { items: LeaderboardEntry[]; window: string } {
  return {
    window: "all",
    items: LEADERS.map(([address, githubLogin, totalEarnedUsdc, payoutCount], i) => ({
      rank: i + 1,
      address,
      githubLogin,
      totalEarnedUsdc,
      payoutCount,
    })),
  };
}

export function demoHunter(address: string): HunterProfile {
  const row = LEADERS.find((l) => l[0].toLowerCase() === address.toLowerCase());
  return {
    address,
    githubLogin: row?.[1],
    totalEarnedUsdc: row?.[2] ?? "0",
    payoutCount: row?.[3] ?? 0,
    reposContributed: 5,
    languages: [
      { name: "TypeScript", count: 6 },
      { name: "Solidity", count: 3 },
      { name: "Go", count: 2 },
    ],
    recentPayouts: [
      {
        bountyId: "0xb07",
        amountUsdc: "2600",
        repoFullName: "octo/payments-sdk",
        language: "TypeScript",
        txHash: "0xpay1",
        createdAt: "2026-05-20T09:05:00Z",
      },
      {
        bountyId: "0xbaa",
        amountUsdc: "1800",
        repoFullName: "mesh/grpc-router",
        language: "Go",
        txHash: "0xpay2",
        createdAt: "2026-05-12T13:00:00Z",
      },
    ],
  };
}

export const demoMe: Me = {
  address: A.demo,
  role: "hunter",
  githubLogin: "you-the-demo",
  hasLinkedGithub: true,
};

export const demoRepos: { repos: GithubRepo[] } = {
  repos: [
    {
      owner: "you",
      name: "side-project",
      fullName: "you/side-project",
      githubRepoId: 9001,
      hasWebhook: true,
    },
    {
      owner: "you",
      name: "infra-tools",
      fullName: "you/infra-tools",
      githubRepoId: 9002,
      private: true,
    },
  ],
};
