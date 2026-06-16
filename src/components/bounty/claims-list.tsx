import { ExternalLink } from "lucide-react";
import { AddressAvatar } from "@/components/wallet/address-avatar";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { safeHref, shortAddress, timeAgo } from "@/lib/utils";
import type { ClaimStatus, PublicClaim } from "@/lib/types";

const TONE: Record<ClaimStatus, NonNullable<BadgeProps["tone"]>> = {
  active: "primary",
  submitted: "secondary",
  paid: "success",
  released: "neutral",
  expired: "neutral",
};

export function ClaimsList({ claims }: { claims: PublicClaim[] }) {
  if (!claims?.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No claims yet — be the first to take this on.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {claims.map((c, i) => (
        <li
          key={`${c.hunterAddress}-${i}`}
          className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-3 py-2.5"
        >
          <div className="flex items-center gap-2.5">
            <AddressAvatar address={c.hunterAddress} size={24} />
            <div className="leading-tight">
              <p className="font-mono text-xs">{shortAddress(c.hunterAddress)}</p>
              {c.createdAt && (
                <p className="text-[11px] text-muted-foreground">
                  {timeAgo(c.createdAt)}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {c.prUrl && (
              <a
                href={safeHref(c.prUrl)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                PR #{c.prNumber}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <Badge tone={TONE[c.status] ?? "neutral"}>{c.status}</Badge>
          </div>
        </li>
      ))}
    </ul>
  );
}
