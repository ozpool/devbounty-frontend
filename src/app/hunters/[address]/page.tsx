"use client";

import { Coins, ExternalLink, FolderGit2, Github, Trophy } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { EmptyState } from "@/components/common/empty-state";
import { StatCard } from "@/components/common/stat-card";
import { AddressAvatar } from "@/components/wallet/address-avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useHunter } from "@/hooks/use-reputation";
import { ApiError } from "@/lib/api";
import { explorerAddressUrl, explorerTxUrl } from "@/lib/chains";
import { formatUsdc, shortAddress, timeAgo } from "@/lib/utils";

export default function HunterPage({ params }: { params: { address: string } }) {
  const { data: h, isPending, isError, error, refetch } = useHunter(params.address);

  if (isPending) return <ProfileSkeleton />;
  if (isError) {
    return (
      <div className="container max-w-3xl py-12">
        {error instanceof ApiError && error.status === 404 ? (
          <EmptyState
            title="Hunter not found"
            description="No payout history exists for this address yet."
          />
        ) : (
          <ErrorState message="Couldn't load this profile." onRetry={() => refetch()} />
        )}
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-12">
      <div className="flex items-center gap-4">
        <AddressAvatar address={h.address} size={56} />
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold">
            {h.githubLogin ? `@${h.githubLogin}` : shortAddress(h.address, 6)}
          </h1>
          <a
            href={explorerAddressUrl(h.address)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {shortAddress(h.address, 6)}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
        {h.githubLogin && (
          <Badge tone="success" className="ml-auto">
            <Github className="h-3 w-3" />
            {h.githubLogin}
          </Badge>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Coins}
          label="Total earned"
          value={`$${formatUsdc(h.totalEarnedUsdc)}`}
          hint="USDC, all-time"
        />
        <StatCard icon={Trophy} label="Payouts" value={h.payoutCount} />
        <StatCard
          icon={FolderGit2}
          label="Repos contributed"
          value={h.reposContributed}
        />
      </div>

      {h.languages?.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Languages
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {h.languages.map((l) => (
              <Badge key={l.name} tone="secondary">
                {l.name}
                <span className="text-secondary/70">· {l.count}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recent payouts
        </h2>
        <div className="mt-3">
          {h.recentPayouts?.length ? (
            <ul className="overflow-hidden rounded-2xl border border-border">
              {h.recentPayouts.map((p, i) => (
                <li
                  key={p.txHash + i}
                  className="flex items-center justify-between gap-4 border-b border-border/60 bg-card/30 px-4 py-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.repoFullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.language ? `${p.language} · ` : ""}
                      {p.createdAt ? timeAgo(p.createdAt) : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-primary">
                      ${formatUsdc(p.amountUsdc)}
                    </span>
                    <a
                      href={explorerTxUrl(p.txHash)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-primary"
                      aria-label="View transaction"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No payouts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container max-w-3xl py-12">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
      <Skeleton className="mt-8 h-40 w-full rounded-2xl" />
    </div>
  );
}
