import * as React from "react";
import { env } from "@/lib/env";
import { explorerAddressUrl } from "@/lib/chains";

/** An on-chain address rendered as a monospace link to the block explorer. */
function AddressLink({ address }: { address: string }) {
  return (
    <a
      href={explorerAddressUrl(address)}
      target="_blank"
      rel="noreferrer"
      className="break-all font-mono text-sm text-primary underline underline-offset-2 hover:text-foreground"
    >
      {address}
    </a>
  );
}

/** A labelled fact card used inside several sections. */
function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="ring-gradient rounded-2xl border border-border bg-card/40 p-5">
      <p className="font-display text-lg font-semibold text-foreground">{k}</p>
      <p className="mt-1 text-sm text-muted-foreground">{v}</p>
    </div>
  );
}

/** A tidy bullet list with the project's accent markers. */
function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export interface WpEntry {
  id: string;
  title: string;
  body: React.ReactNode;
}

/**
 * The numbered body sections of the white paper. The cover and table of
 * contents are rendered separately by the page; everything else lives here so
 * the copy is in one place, edited without touching layout code.
 */
export const SECTIONS: WpEntry[] = [
  {
    id: "summary",
    title: "Executive Summary",
    body: (
      <>
        <p>
          DevBounty is a decentralized bug-bounty platform that removes the custodian
          from the middle of every payout. Sponsors fund bounties in USDC that are held
          by a smart-contract escrow on Arbitrum, not by a company account. When a
          maintainer merges the pull request that fixes the issue, the protocol releases
          the escrowed funds to the security researcher automatically - no invoices, no
          manual approval, no waiting.
        </p>
        <p>
          The result is a bounty market where the rules are enforced by code: funds are
          provably reserved before work starts, the merge is the single trigger for
          payment, and every settlement is verifiable on-chain. Researchers accrue
          reputation from real, paid fixes, surfaced through public profiles and a
          leaderboard.
        </p>
      </>
    ),
  },
  {
    id: "problem",
    title: "The Problem",
    body: (
      <>
        <p>
          Traditional bug-bounty platforms sit between the sponsor and the researcher as
          a trusted intermediary. That position creates recurring friction that the
          industry has simply learned to tolerate:
        </p>
        <Bullets
          items={[
            "Custody risk - sponsor funds sit in a platform's bank account, exposed to freezes, insolvency, and unilateral policy changes.",
            "Slow, opaque payouts - researchers chase invoices for weeks while a reviewer decides, off the record, whether and how much to pay.",
            "Trust asymmetry - a researcher has no guarantee the money exists until after the work is disclosed.",
            "Platform lock-in - reputation is trapped inside one walled garden and cannot be independently verified.",
          ]}
        />
      </>
    ),
  },
  {
    id: "solution",
    title: "The Solution",
    body: (
      <>
        <p>
          DevBounty replaces the trusted intermediary with an escrow contract and a
          verifiable trigger. The money is locked before a researcher lifts a finger,
          and the act that proves the work was accepted - a maintainer merging the pull
          request - is the same act that releases payment.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Fact
            k="Funds held by code"
            v="USDC sits in escrow on-chain, not in a company account."
          />
          <Fact
            k="Merge is the trigger"
            v="A merged PR releases payment - no manual approval step."
          />
          <Fact
            k="Verifiable settlement"
            v="Every payout is an on-chain transaction anyone can audit."
          />
        </div>
      </>
    ),
  },
  {
    id: "how-it-works",
    title: "How It Works",
    body: (
      <>
        <p>The full lifecycle of a bounty, from funding to settlement:</p>
        <Bullets
          items={[
            "A sponsor connects a wallet and GitHub account, picks an issue, and funds a bounty with USDC into the escrow contract.",
            "A hunter claims the bounty - subject to gating, a per-user cap, an expiry, and a cooldown - then submits a fix as a pull request.",
            "A maintainer merges the pull request. GitHub sends a signed webhook to the API.",
            "The API verifies the webhook signature, matches the merge to the bounty and claim, and calls the escrow contract to release funds to the hunter.",
            "A chain indexer watches the contract's events and keeps the off-chain records and the leaderboard in sync.",
          ]}
        />
      </>
    ),
  },
  {
    id: "disputes",
    title: "Dispute Resolution",
    body: (
      <>
        <p>
          The merge is a deliberately simple, binding signal. That keeps the protocol
          trust-minimized, but the merge is not always a clean signal - so DevBounty’s
          policy on each edge case is stated explicitly rather than left to discretion:
        </p>
        <Bullets
          items={[
            "Maintainer merges a low-quality or unrelated fix - merge is final and binding by design. DevBounty does not arbitrate code quality; the repository's own maintainer is the authority on what counts as an accepted fix, exactly as in a normal pull-request review. Sponsors choose which repositories and maintainers they trust when they fund.",
            "Maintainer refuses to merge a valid fix - there is no on-chain arbitration in this version. The claim runs to its expiry and the bounty returns to the open pool; the dispute is social, surfaced through the hunter's public record, not settled by the protocol. On-chain mediation is explicitly out of scope for now.",
            "Claim expires without a merged PR - the claim is released automatically and the bounty becomes claimable again. No action is required and the sponsor's escrow is untouched.",
            "Sponsor disappears mid-claim - it cannot strand a hunter. The full bounty is locked in escrow at funding time, before any claim, so the funds a merge would release are already on-chain and beyond the sponsor's unilateral control.",
          ]}
        />
      </>
    ),
  },
  {
    id: "market",
    title: "Market Opportunity",
    body: (
      <>
        <p>
          Software security spend keeps climbing as supply-chain and open-source
          vulnerabilities move from edge case to headline. Crowdsourced security -
          paying independent researchers for real findings - is the fastest-growing
          slice of that spend, yet it still runs on centralized custodians and manual
          payout pipelines.
        </p>
        <p>
          The bug-bounty platform market was valued at roughly $1.5 billion in 2024 and
          is projected to grow at about a 15% CAGR, approaching $5-6 billion by the
          early 2030s. Established platforms - HackerOne, Bugcrowd, and Immunefi -
          process most of that volume today, but they settle in fiat or rely on managed,
          custodial payout review. Even Immunefi, the closest Web3 analog, releases
          funds through a managed process rather than non-custodial on-chain escrow.
        </p>
        <p>
          DevBounty’s differentiation is settlement, not sourcing: the same researcher
          pool, paid by code instead of by a back office. Web3 protocols in particular
          need a bounty venue that is itself trust-minimized - paying in stablecoins,
          settling on-chain, and proving fund availability up front.
        </p>
        <p className="text-xs text-muted-foreground">
          Market figures:{" "}
          <a
            href="https://www.globalgrowthinsights.com/market-reports/bug-bounty-platforms-market-116066"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Global Growth Insights, Bug Bounty Platforms Market (2024-2033)
          </a>
          . Estimates vary by source; treated here as directional, not precise.
        </p>
      </>
    ),
  },
  {
    id: "architecture",
    title: "Technology & Architecture",
    body: (
      <>
        <p>
          DevBounty is built so that the trust-critical step - releasing money - is
          owned by exactly one component and verified on-chain.
        </p>
        <Bullets
          items={[
            "Escrow contract - a BountyEscrow contract (OpenZeppelin, deployed to Arbitrum) holds USDC and exposes a guarded release path.",
            "API & indexer - an Express API handles auth, the bounty lifecycle, and the webhook that owns the on-chain release; a single indexer reads and syncs contract events.",
            "Authentication - wallet-based sign-in (SIWE) issues a session; GitHub OAuth links the identity needed to attribute pull requests.",
            "Webhook owns release - only the verified GitHub-merge webhook can trigger a payout, so a bounty can never be double-released.",
            "Defense in depth - webhook signatures are verified, OAuth tokens are encrypted at rest (AES-256-GCM), and on-chain signer custody is hardened before production.",
          ]}
        />
      </>
    ),
  },
  {
    id: "security-status",
    title: "Security & Audit Status",
    body: (
      <>
        <p>
          DevBounty is currently deployed on Arbitrum Sepolia (testnet) and has not
          undergone a third-party security audit. The BountyEscrow contract is unaudited
          and should be treated as experimental.
        </p>
        <div className="ring-gradient rounded-2xl border border-border bg-card/40 p-5">
          <p className="font-display text-sm font-semibold text-foreground">
            Deployed contracts (Arbitrum Sepolia, source-verified)
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
              <dt className="text-muted-foreground">BountyEscrow</dt>
              <dd>
                <AddressLink address={env.escrowAddress || ""} />
              </dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
              <dt className="text-muted-foreground">USDC (mock)</dt>
              <dd>
                <AddressLink address={env.usdcAddress} />
              </dd>
            </div>
          </dl>
        </div>
        <Bullets
          items={[
            "Testnet only - the live deployment uses a mock USDC token, not real funds, so nothing of monetary value is currently at risk.",
            "Unaudited - a formal audit by a recognized smart-contract auditor is planned ahead of any mainnet deployment.",
            "Experimental - do not treat the contract as production-grade; do not fund bounties with money you cannot afford to lose once real funds are supported.",
            "Reporting - vulnerabilities in the contract or API can be reported privately through the project's GitHub issues.",
          ]}
        />
      </>
    ),
  },
  {
    id: "economics",
    title: "Economics & Reputation",
    body: (
      <>
        <p>
          DevBounty settles in USDC so that bounty values are stable and predictable for
          both sides. The escrow holds the full bounty amount for the lifetime of a
          claim, and releases it in a single on-chain transfer on a verified merge.
        </p>
        <Bullets
          items={[
            "Stablecoin settlement - bounties are denominated and paid in USDC, removing volatility from the reward.",
            "Reputation from real payouts - a hunter's standing is computed from merged, paid fixes, so it cannot be inflated by unverifiable claims.",
            "Public, portable record - profiles and the leaderboard expose that on-chain history for anyone to verify.",
          ]}
        />
      </>
    ),
  },
  {
    id: "fees",
    title: "Fees & Sustainability",
    body: (
      <>
        <p>
          DevBounty charges no protocol fee during the testnet phase: a merged bounty
          releases its full amount to the hunter. Sustainability is a mainnet question,
          not a testnet one, and the priority for now is proving the settlement
          mechanism rather than baking in a fee before the model is justified.
        </p>
        <p>
          A fee model will be proposed before mainnet. The intended
          shape is a small percentage taken only at settlement - on a successful, paid
          resolution - with no fee on funding or claiming, so the protocol earns only
          when a researcher actually gets paid. Any such fee, its rate, and where it is
          routed will be published before it is enabled.
        </p>
      </>
    ),
  },
  {
    id: "team",
    title: "Team & Governance",
    body: (
      <>
        <p>
          The core team is currently pseudonymous, consistent with the project’s early,
          testnet stage and open development. This is a deliberate, disclosed choice
          rather than an omission: DevBounty commits to publishing the identities of the
          people responsible for signer custody before any mainnet launch, and before
          the escrow holds real sponsor funds.
        </p>
        <p>
          The design intentionally minimizes how much trust that team requires. The
          contract holds the funds, a verified merge - not a person - triggers each
          payout, and every settlement is public. Governance follows least privilege:
          the one component that can move money is isolated and auditable, signer
          custody is documented and progressively hardened (an environment key on
          testnet, a KMS or HSM in production), and operational changes are made in the
          open rather than behind a custodial wall.
        </p>
      </>
    ),
  },
  {
    id: "conclusion",
    title: "Conclusion & Call to Action",
    body: (
      <>
        <p>
          Bug bounties work best when both sides can trust the rules. DevBounty makes
          those rules enforceable: the money is real and reserved before work begins,
          the merge is the trigger, and the payout is verifiable on-chain.
        </p>
        <p>
          Sponsors get provable fund availability and automatic settlement. Researchers
          get a guarantee that a merged fix is a paid fix, plus a portable reputation
          built from on-chain history.
        </p>
        <p>
          DevBounty is live on testnet today, with mainnet deployment gated on the audit
          and hardening work outlined above. Sponsors and researchers can evaluate the
          protocol now and follow its progress in the open.
        </p>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer & References",
    body: (
      <>
        <p>
          This document describes the design and intent of the DevBounty platform. It is
          provided for informational purposes only and does not constitute financial,
          legal, or investment advice, nor an offer or solicitation of any kind.
          Smart-contract systems carry inherent risk; figures and timelines are targets,
          not guarantees, and may change as the protocol evolves.
        </p>
        <p className="text-sm">
          References: the BountyEscrow contract source, the public API, and the on-chain
          transaction history are the authoritative record of how the protocol behaves.
          Where this document and the deployed code disagree, the code governs.
        </p>
      </>
    ),
  },
];
