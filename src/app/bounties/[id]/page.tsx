"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Clock, ShieldCheck, User, Receipt } from "lucide-react";
import { StatusBadge } from "@/components/bounty/status-badge";
import { ClaimsList } from "@/components/bounty/claims-list";
import { ClaimActions } from "@/components/bounty/claim-actions";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { AddressAvatar } from "@/components/wallet/address-avatar";
import { useBounty } from "@/hooks/use-bounties";
import { ApiError } from "@/lib/api";
import { explorerAddressUrl, explorerTxUrl } from "@/lib/chains";
import { formatUsdc, safeHref, shortAddress, timeAgo } from "@/lib/utils";

function MetaRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Clock;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm">
      <span className="inline-flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="font-medium">{children}</span>
    </div>
  );
}

export default function BountyDetailPage({ params }: { params: { id: string } }) {
  const { data: b, isPending, isError, error, refetch } = useBounty(params.id);

  return (
    <div className="container max-w-5xl py-10">
      <Link
        href="/bounties"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to board
      </Link>

      {isPending ? (
        <DetailSkeleton />
      ) : isError ? (
        error instanceof ApiError && error.status === 404 ? (
          <EmptyState
            className="mt-8"
            title="Bounty not found"
            description="This bounty may have been removed, or the link is wrong."
          />
        ) : (
          <ErrorState
            title="Couldn't load this bounty"
            message="The API may be offline."
            onRetry={() => refetch()}
          />
        )
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={b.lifecycleStatus} />
              <Badge tone="secondary">{b.language}</Badge>
              <Badge tone="outline">on-chain: {b.onChainStatus}</Badge>
            </div>

            <h1 className="mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl">
              {b.issueTitle}
            </h1>
            <a
              href={safeHref(b.issueUrl)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {b.repo.fullName} · #{b.issueNumber}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <div className="mt-8">
              <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Claims
              </h2>
              <div className="mt-3">
                <ClaimsList claims={b.claims} />
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="ring-gradient rounded-2xl border border-border bg-card/40 p-5">
              <p className="text-xs text-muted-foreground">Reward</p>
              <p className="font-display text-4xl font-bold text-primary">
                ${formatUsdc(b.amountUsdc)}
                <span className="ml-1.5 text-sm font-medium text-muted-foreground">
                  USDC
                </span>
              </p>
              <div className="mt-4 divide-y divide-border border-t border-border">
                <MetaRow icon={User} label="Sponsor">
                  <a
                    href={explorerAddressUrl(b.maintainerAddress)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono hover:text-primary"
                  >
                    <AddressAvatar address={b.maintainerAddress} size={18} />
                    {shortAddress(b.maintainerAddress)}
                  </a>
                </MetaRow>
                <MetaRow icon={ShieldCheck} label="Refund window">
                  {Math.round(b.refundWindowSnapshot / 86400)}d
                </MetaRow>
                {b.createdAt && (
                  <MetaRow icon={Clock} label="Posted">
                    {timeAgo(b.createdAt)}
                  </MetaRow>
                )}
                {[
                  { label: "Funding tx", hash: b.txCreate },
                  { label: "Payout tx", hash: b.txRelease },
                  { label: "Refund tx", hash: b.txRefund },
                ]
                  .flatMap((t) => (t.hash ? [{ label: t.label, hash: t.hash }] : []))
                  .map((t) => (
                    <MetaRow key={t.label} icon={Receipt} label={t.label}>
                      <a
                        href={explorerTxUrl(t.hash)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono hover:text-primary"
                      >
                        {t.hash.slice(0, 10)}…
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </MetaRow>
                  ))}
              </div>
            </div>

            <ClaimActions bounty={b} />
          </aside>
        </div>
      )}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-4 h-9 w-3/4" />
        <Skeleton className="mt-3 h-4 w-52" />
        <Skeleton className="mt-8 h-24 w-full" />
      </div>
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  );
}
