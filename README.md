# DevBounty — Web

The Next.js frontend for DevBounty: a decentralized bug-bounty platform where
sponsors fund USDC bounties in non-custodial escrow on Arbitrum and hunters get
paid automatically when a maintainer merges their fix.

This app is read-and-act UI only. It never holds funds or decides payouts — it
reads the chain, talks to the API, and prompts the wallet for signatures.

## Stack

- Next.js 14 (App Router) · TypeScript
- Tailwind CSS · custom design system · Framer Motion
- wagmi v2 · viem · RainbowKit (wallet) · SIWE (auth)
- TanStack Query (data) · Zustand (session/theme)

## Quickstart

This repo uses **pnpm** (pinned via `packageManager` in `package.json`); enable it
with `corepack enable` if you don't have it.

```bash
pnpm install
cp .env.example .env.local   # fill in the values below
pnpm dev                     # http://localhost:3000
```

The API is expected at `http://localhost:4000` by default (cookie auth, so the
browser sends the session cookie automatically).

## Scripts

| Script           | Does                          |
| ---------------- | ----------------------------- |
| `pnpm dev`       | Dev server with HMR           |
| `pnpm build`     | Production build              |
| `pnpm start`     | Serve the production build    |
| `pnpm lint`      | ESLint (next/core-web-vitals) |
| `pnpm typecheck` | `tsc --noEmit`                |
| `pnpm test`      | Vitest (jsdom + RTL)          |
| `pnpm format`    | Prettier write                |

## Environment

All client config is `NEXT_PUBLIC_*` (exposed to the browser — no secrets):

| Variable                               | Purpose                                |
| -------------------------------------- | -------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`             | Backend API origin                     |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Cloud id                 |
| `NEXT_PUBLIC_CHAIN_ID`                 | `421614` (Arbitrum Sepolia)            |
| `NEXT_PUBLIC_RPC_URL`                  | Arbitrum Sepolia RPC endpoint          |
| `NEXT_PUBLIC_USDC_ADDRESS`             | USDC token address                     |
| `NEXT_PUBLIC_ESCROW_ADDRESS`           | Escrow contract (empty until deployed) |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID`         | GitHub OAuth client id (linking)       |
| `NEXT_PUBLIC_DEMO_MODE`                | `true` serves demo fixtures offline    |
| `NEXT_PUBLIC_SENTRY_DSN`               | Sentry DSN (optional)                  |

## Structure

```
src/
  app/            routes (App Router)
  components/     ui primitives, layout chrome, feature components
  hooks/          TanStack Query + wallet hooks
  lib/            api client, wagmi/chain config, types, utils
  store/          Zustand stores (session, theme)
```

## Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel (it auto-detects Next.js).
2. Set the `NEXT_PUBLIC_*` env vars above in the Vercel project (Production +
   Preview). Leave `NEXT_PUBLIC_ESCROW_ADDRESS` blank until the contract ships —
   the funding flow stays disabled while it's empty.
3. On the backend, allow the Vercel origin in CORS and set the session cookie to
   `SameSite=None; Secure` (auth is cross-site in production).
4. Security headers + CSP ship from `next.config.mjs`; no extra Vercel config
   needed.

CI gates to run before deploy: `pnpm lint`, `pnpm typecheck`, `pnpm test`,
`pnpm build`.

## Status

Auth, the bounty board and detail, leaderboard, public profiles, and the
dashboards are built against the API and covered by unit tests. The on-chain
actions (USDC `approve`, escrow `create`/`refund`) are fully wired and gated on
`NEXT_PUBLIC_ESCROW_ADDRESS` — they activate automatically once the
`BountyEscrow` contract is deployed and its address is configured.
