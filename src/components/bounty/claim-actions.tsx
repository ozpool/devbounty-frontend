"use client";

import * as React from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { CircleCheck, GitPullRequestArrow, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { GithubLinkButton } from "@/components/auth/github-link-button";
import { MaintainerPanel } from "./maintainer-panel";
import { useBountyActions } from "@/hooks/use-bounty-actions";
import { useSessionStore } from "@/store/session";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { BountyDetail } from "@/lib/types";

const errMsg = (e: unknown) =>
  e instanceof ApiError ? e.message : "Something went wrong. Try again.";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function ClaimActions({ bounty }: { bounty: BountyDetail }) {
  const me = useSessionStore((s) => s.me);
  const status = useSessionStore((s) => s.status);
  const { address } = useAccount();
  const toast = useToast();
  const { claim, releaseClaim, submitPr } = useBountyActions(bounty.bountyId);
  const [prUrl, setPrUrl] = React.useState("");

  const lower = (s?: string) => (s ?? "").toLowerCase();
  const mine = bounty.claims.find((c) => lower(c.hunterAddress) === lower(me?.address));
  const isMaintainer = lower(me?.address) === lower(bounty.maintainerAddress);
  const othersActive = bounty.claims.some(
    (c) => c.status === "active" && lower(c.hunterAddress) !== lower(me?.address),
  );
  const isOpen = bounty.lifecycleStatus === "open";

  // Not signed in.
  if (status !== "authenticated" || !me) {
    return (
      <Panel title="Take this bounty">
        <p className="text-sm text-muted-foreground">
          Sign in with your wallet to claim and submit a fix.
        </p>
        <Link
          href={`/login?next=/bounties/${bounty.bountyId}`}
          className={cn(buttonVariants(), "mt-4 w-full")}
        >
          <LogIn className="h-4 w-4" />
          Sign in to claim
        </Link>
      </Panel>
    );
  }

  // Maintainer view (funding/refund are on-chain, gated on contract deploy).
  if (isMaintainer) {
    return <MaintainerPanel bounty={bounty} />;
  }

  // Hunter without a linked GitHub identity.
  if (!me.hasLinkedGithub) {
    return (
      <Panel title="Take this bounty">
        <p className="text-sm text-muted-foreground">
          Link your GitHub account first — it&apos;s how merges map back to your payout,
          and it keeps claims Sybil-resistant.
        </p>
        <GithubLinkButton className="mt-4 w-full" />
      </Panel>
    );
  }

  // Hunter has an active claim → submit a PR.
  if (mine?.status === "active") {
    return (
      <Panel title="Submit your fix">
        <p className="text-sm text-muted-foreground">
          Opened a pull request? Paste its URL to link it to this bounty.
        </p>
        <div className="mt-4 space-y-3">
          <Input
            type="url"
            value={prUrl}
            onChange={(e) => setPrUrl(e.target.value)}
            placeholder="https://github.com/owner/repo/pull/123"
            aria-label="Pull request URL"
            aria-describedby={submitPr.isError ? "pr-submit-error" : undefined}
          />
          <Button
            className="w-full"
            disabled={!prUrl || submitPr.isPending}
            onClick={() =>
              submitPr.mutate(prUrl, {
                onSuccess: () =>
                  toast.success(
                    "Pull request submitted",
                    "Escrow releases when it's merged.",
                  ),
                onError: (e) => toast.error("Couldn't submit", errMsg(e)),
              })
            }
          >
            {submitPr.isPending ? (
              <Spinner />
            ) : (
              <GitPullRequestArrow className="h-4 w-4" />
            )}
            Submit pull request
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            disabled={releaseClaim.isPending}
            onClick={() =>
              releaseClaim.mutate(undefined, {
                onSuccess: () => toast.info("Claim released"),
                onError: (e) => toast.error("Couldn't release", errMsg(e)),
              })
            }
          >
            Release my claim
          </Button>
          {submitPr.isError && (
            <p id="pr-submit-error" className="text-xs text-danger">
              {errMsg(submitPr.error)}
            </p>
          )}
        </div>
      </Panel>
    );
  }

  // Hunter already submitted.
  if (mine?.status === "submitted") {
    return (
      <Panel title="Awaiting merge">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <CircleCheck className="mt-0.5 h-4 w-4 text-success" />
          <span>
            Your PR is linked. When the maintainer merges it, the escrow releases to
            your wallet automatically.
          </span>
        </div>
      </Panel>
    );
  }

  // Open and free to claim.
  if (isOpen && !othersActive) {
    return (
      <Panel title="Take this bounty">
        <p className="text-sm text-muted-foreground">
          Reserves the bounty for you for 7 days. No gas — it&apos;s an off-chain soft
          lock.
        </p>
        <Button
          className="mt-4 w-full"
          disabled={claim.isPending}
          onClick={() =>
            claim.mutate(undefined, {
              onSuccess: () =>
                toast.success("Bounty claimed", "Reserved for you for 7 days."),
              onError: (e) => toast.error("Couldn't claim", errMsg(e)),
            })
          }
        >
          {claim.isPending ? <Spinner /> : null}
          Claim bounty
        </Button>
        {claim.isError && (
          <p className="mt-2 text-xs text-danger">{errMsg(claim.error)}</p>
        )}
      </Panel>
    );
  }

  // Claimed by someone else, or terminal state.
  return (
    <Panel title="Unavailable">
      <p className="text-sm text-muted-foreground">
        {othersActive
          ? "Another hunter is working on this right now. Check back if the claim expires."
          : "This bounty is no longer open for new claims."}
      </p>
    </Panel>
  );
}
