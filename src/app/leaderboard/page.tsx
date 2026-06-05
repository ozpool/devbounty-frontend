"use client";

import * as React from "react";
import { Trophy } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Select } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { WindowToggle } from "@/components/leaderboard/window-toggle";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { useLeaderboard } from "@/hooks/use-reputation";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

const LANGS = ["", ...SUPPORTED_LANGUAGES];

export default function LeaderboardPage() {
  const [lang, setLang] = React.useState("");
  const [timeWindow, setTimeWindow] = React.useState<"30d" | "all">("all");
  const { data, isPending, isError, refetch } = useLeaderboard(lang, timeWindow);
  const entries = data?.items ?? [];

  return (
    <div className="container max-w-3xl py-12">
      <PageHeader
        title="Leaderboard"
        description="Top hunters by USDC earned from merged fixes — ranked from on-chain payouts."
      />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <Select value={lang} onChange={(e) => setLang(e.target.value)} className="w-44">
          {LANGS.map((l) => (
            <option key={l} value={l}>
              {l || "All languages"}
            </option>
          ))}
        </Select>
        <WindowToggle value={timeWindow} onChange={setTimeWindow} />
      </div>

      <div className="mt-6">
        {isPending ? (
          <ListSkeleton />
        ) : isError ? (
          <ErrorState
            message="Couldn't load the leaderboard — the API may be offline."
            onRetry={() => refetch()}
          />
        ) : entries.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No payouts yet"
            description="Once hunters start getting paid for merged fixes, the rankings appear here."
          />
        ) : (
          <LeaderboardTable entries={entries} />
        )}
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-2xl" />
      ))}
    </div>
  );
}
