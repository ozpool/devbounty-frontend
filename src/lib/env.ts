import { isAddress } from "viem";

/**
 * Single source for public client config. Nothing else should read
 * `process.env` directly (mirrors the backend's config/env discipline).
 * All vars are NEXT_PUBLIC_* — inlined at build, safe in the browser.
 */
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  /** Override the public RPC (rate-limited) before on-chain reads go live. */
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "",
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 421614),
  // Defaults are the live Arbitrum Sepolia deployment, so a build with no env
  // set (e.g. a fresh Vercel deploy) still targets the real contracts. Set the
  // NEXT_PUBLIC_* vars to point at a different deployment.
  usdcAddress: (process.env.NEXT_PUBLIC_USDC_ADDRESS ||
    "0x3FD372BF3AE46539e5F07D9Bc00c2E5dfA0F0E2e") as `0x${string}`,
  escrowAddress: (process.env.NEXT_PUBLIC_ESCROW_ADDRESS ||
    "0x8B71467B545aEdC0F4fc2094c46efEe2CB47Da9F") as `0x${string}` | "",
  githubClientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "",
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  /** Serve seeded dummy data instead of calling the API (deployable without a backend). */
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
} as const;

/** Escrow is usable only once a well-formed address is configured (post-deploy). */
export const isEscrowConfigured = isAddress(env.escrowAddress, {
  strict: false,
});

// Fail loudly (in the browser) if a misconfigured token address slips through.
if (typeof window !== "undefined" && !isAddress(env.usdcAddress, { strict: false })) {
  console.error("NEXT_PUBLIC_USDC_ADDRESS is not a valid address:", env.usdcAddress);
}
