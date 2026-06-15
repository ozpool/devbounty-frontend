import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./status-badge";
import { formatUsdc, timeAgo } from "@/lib/utils";
import type { Bounty } from "@/lib/types";

export function BountyCard({ bounty }: { bounty: Bounty }) {
  return (
    <Link href={`/bounties/${bounty.bountyId}`} className="group block h-full">
      <article className="ring-gradient flex h-full flex-col rounded-2xl border border-border bg-card/40 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
        <div className="flex items-center justify-between gap-2">
          <StatusBadge status={bounty.lifecycleStatus} />
          <Badge tone="secondary">{bounty.language}</Badge>
        </div>

        <p className="mt-4 truncate font-mono text-xs text-muted-foreground">
          {bounty.repo.fullName} · #{bounty.issueNumber}
        </p>
        <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold leading-snug transition-colors group-hover:text-primary">
          {bounty.issueTitle}
        </h3>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Reward</p>
              <p className="font-display text-2xl font-bold text-primary">
                ${formatUsdc(bounty.amountUsdc)}
                <span className="ml-1 text-xs font-medium text-muted-foreground">
                  USDC
                </span>
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-primary">
              View
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
          {bounty.createdAt && (
            <p className="mt-3 text-xs text-muted-foreground">
              Posted {timeAgo(bounty.createdAt)}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
