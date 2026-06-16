import {
  demoBountyDetail,
  demoBountyList,
  demoHunter,
  demoLeaderboard,
  demoMe,
  demoRepos,
} from "./fixtures";
import { demoAuth } from "./auth";

/** Returned when a route has no demo handler (caller maps it to a 404). */
export const UNHANDLED = Symbol("unhandled");
/** Returned for /me when the demo session is signed out (caller maps to 401). */
export const UNAUTHENTICATED = Symbol("unauthenticated");

/**
 * Maps an API (method, path, query) to seeded demo data. Loaded only in demo
 * mode (dynamic import) so it never ships in a normal build.
 */
export function resolveDemo(
  method: string,
  path: string,
  query: Record<string, string>,
): unknown {
  const p = path.replace(/^\//, "").replace(/\/$/, "");
  const m = method.toUpperCase();

  if (p === "auth/siwe/nonce") return { nonce: "demo-nonce" };
  if (p === "auth/siwe/verify") {
    demoAuth.setSignedIn(true);
    return { user: demoMe };
  }
  if (p === "auth/logout") {
    demoAuth.setSignedIn(false);
    return { ok: true };
  }
  if (p === "me") return demoAuth.isSignedIn() ? demoMe : UNAUTHENTICATED;

  if (p === "bounties" && m === "GET") return demoBountyList(query);
  if (p === "bounties" && m === "POST")
    return { bountyId: "0xdemoCreated", lifecycleStatus: "pending_deposit" };

  const detail = p.match(/^bounties\/([^/]+)$/);
  if (detail) return demoBountyDetail(detail[1]) ?? UNHANDLED;

  if (/^bounties\/[^/]+\/claim$/.test(p))
    return m === "DELETE"
      ? { bountyId: detail?.[1], status: "released" }
      : { bountyId: detail?.[1], expiresAt: "2026-06-07T00:00:00Z" };
  if (/^bounties\/[^/]+\/submit$/.test(p))
    return { bountyId: "demo", prUrl: "", prNumber: 999 };
  if (/^bounties\/[^/]+\/refund-eligibility$/.test(p))
    return {
      eligible: true,
      reason: "refund window elapsed",
      windowExpiresAt: "2026-05-20T00:00:00Z",
    };
  if (/^bounties\/[^/]+\/refund-recorded$/.test(p))
    return { bountyId: "demo", status: "refunded" };

  if (p === "leaderboard") return demoLeaderboard();
  const hunter = p.match(/^hunters\/([^/]+)$/);
  if (hunter) return demoHunter(hunter[1]);

  if (p === "repos") return demoRepos;

  return UNHANDLED;
}
