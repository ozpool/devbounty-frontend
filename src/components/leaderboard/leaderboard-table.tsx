import Link from "next/link";
import { AddressAvatar } from "@/components/wallet/address-avatar";
import { cn, formatUsdc, shortAddress } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/types";

const rankColor = (r: number) =>
  r === 1
    ? "text-yellow-400"
    : r === 2
      ? "text-zinc-300"
      : r === 3
        ? "text-amber-600"
        : "text-muted-foreground";

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      {entries.map((e) => (
        <Link
          key={e.address}
          href={`/hunters/${e.address}`}
          className="flex items-center gap-4 border-b border-border/60 bg-card/30 px-4 py-3 transition-colors last:border-0 hover:bg-accent/40"
        >
          <span
            className={cn(
              "w-8 shrink-0 text-center font-display text-lg font-bold tabular-nums",
              rankColor(e.rank),
            )}
          >
            {e.rank}
          </span>
          <AddressAvatar address={e.address} size={32} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {e.githubLogin ? `@${e.githubLogin}` : shortAddress(e.address)}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {shortAddress(e.address)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-base font-bold text-primary">
              ${formatUsdc(e.totalEarnedUsdc)}
            </p>
            <p className="text-xs text-muted-foreground">
              {e.payoutCount} payout{e.payoutCount === 1 ? "" : "s"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
