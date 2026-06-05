import { describe, it, expect, beforeEach } from "vitest";
import { resolveDemo, UNHANDLED, UNAUTHENTICATED } from "./resolve";
import { demoAuth } from "./auth";
import type {
  Bounty,
  BountyDetail,
  LeaderboardEntry,
  Me,
  Paginated,
} from "@/lib/types";

beforeEach(() => demoAuth.setSignedIn(true));

describe("resolveDemo demo auth", () => {
  it("returns the user from /me when signed in", () => {
    const me = resolveDemo("GET", "/me", {}) as Me;
    expect(me.address).toBeTruthy();
  });
  it("signs out on /auth/logout, so /me becomes unauthenticated", () => {
    resolveDemo("POST", "/auth/logout", {});
    expect(resolveDemo("GET", "/me", {})).toBe(UNAUTHENTICATED);
  });
  it("signs back in on /auth/siwe/verify", () => {
    resolveDemo("POST", "/auth/logout", {});
    resolveDemo("POST", "/auth/siwe/verify", {});
    const me = resolveDemo("GET", "/me", {}) as Me;
    expect(me.hasLinkedGithub).toBe(true);
  });
});

describe("resolveDemo", () => {
  it("returns a paginated bounty list", () => {
    const res = resolveDemo("GET", "/bounties", {}) as Paginated<Bounty>;
    expect(res.items.length).toBeGreaterThan(0);
    expect(res.total).toBeGreaterThan(0);
  });

  it("filters by language", () => {
    const res = resolveDemo("GET", "/bounties", {
      language: "Solidity",
    }) as Paginated<Bounty>;
    expect(res.items.every((b) => b.language === "Solidity")).toBe(true);
  });

  it("returns a known bounty detail with claims", () => {
    const res = resolveDemo("GET", "/bounties/0xb01", {}) as BountyDetail;
    expect(res.bountyId).toBe("0xb01");
    expect(Array.isArray(res.claims)).toBe(true);
  });

  it("maps an unknown bounty to a 404 sentinel", () => {
    expect(resolveDemo("GET", "/bounties/0xZZZ", {})).toBe(UNHANDLED);
  });

  it("returns the demo session user", () => {
    const res = resolveDemo("GET", "/me", {}) as Me;
    expect(res.address).toBeTruthy();
    expect(res.hasLinkedGithub).toBe(true);
  });

  it("returns a ranked leaderboard", () => {
    const res = resolveDemo("GET", "/leaderboard", {}) as {
      items: LeaderboardEntry[];
    };
    expect(res.items[0].rank).toBe(1);
  });
});
