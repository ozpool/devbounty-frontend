"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Telescope } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { Pagination } from "@/components/common/pagination";
import { BountyFilters } from "@/components/bounty/bounty-filters";
import { BountyCard } from "@/components/bounty/bounty-card";
import { BountyGridSkeleton } from "@/components/bounty/bounty-card-skeleton";
import { MotionItem, Stagger, staggerItem } from "@/components/motion";
import { useBounties } from "@/hooks/use-bounties";
import type { BountyFilters as Filters, LifecycleStatus } from "@/lib/types";

const PAGE_SIZE = 12;

function parseFilters(sp: URLSearchParams): Filters {
  return {
    status: (sp.get("status") as LifecycleStatus | "") || "",
    language: sp.get("language") || "",
    repo: sp.get("repo") || "",
    minAmount: sp.get("minAmount") || "",
    page: Number(sp.get("page") || 1),
    pageSize: PAGE_SIZE,
  };
}

function BoardInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = React.useState<Filters>(() =>
    parseFilters(new URLSearchParams(sp.toString())),
  );

  const update = (patch: Partial<Filters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      const usp = new URLSearchParams();
      if (next.status) usp.set("status", next.status);
      if (next.language) usp.set("language", next.language);
      if (next.repo) usp.set("repo", next.repo);
      if (next.minAmount) usp.set("minAmount", next.minAmount);
      if (next.page && next.page > 1) usp.set("page", String(next.page));
      const qs = usp.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      return next;
    });
  };

  const { data, isPending, isError, refetch } = useBounties(filters);

  return (
    <div className="container py-12">
      <PageHeader
        title="Bounty board"
        description="Browse funded, claimable bug bounties across open-source repositories."
      />

      <div className="mt-8">
        <BountyFilters value={filters} onChange={update} />
      </div>

      <div className="mt-8">
        {isPending ? (
          <BountyGridSkeleton />
        ) : isError ? (
          <ErrorState
            message="Couldn't load bounties — the API may be offline."
            onRetry={() => refetch()}
          />
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            icon={Telescope}
            title="No bounties match"
            description="Try clearing the filters, or check back soon — new bounties land often."
          />
        ) : (
          <>
            <Stagger
              inView={false}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {data.items.map((b) => (
                <MotionItem key={b.bountyId} variants={staggerItem}>
                  <BountyCard bounty={b} />
                </MotionItem>
              ))}
            </Stagger>
            <div className="mt-10">
              <Pagination
                page={filters.page ?? 1}
                pageSize={PAGE_SIZE}
                total={data.total}
                onPageChange={(p) => update({ page: p })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function BountiesPage() {
  return (
    <React.Suspense
      fallback={
        <div className="container py-12">
          <BountyGridSkeleton />
        </div>
      }
    >
      <BoardInner />
    </React.Suspense>
  );
}
