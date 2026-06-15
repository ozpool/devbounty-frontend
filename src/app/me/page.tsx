"use client";

import Link from "next/link";
import { ArrowUpRight, Coins, Plus, Trophy, User } from "lucide-react";
import { RequireAuth } from "@/components/auth/require-auth";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { IdentityCard } from "@/components/dashboard/identity-card";
import { useSessionStore } from "@/store/session";
import { useHunter } from "@/hooks/use-reputation";
import { cn, formatUsdc } from "@/lib/utils";

const QUICK = [
  { href: "/bounties", label: "Browse bounties", icon: ArrowUpRight },
  { href: "/dashboard/new", label: "Post a bounty", icon: Plus },
];

function MeInner() {
  const me = useSessionStore((s) => s.me)!;
  const { data } = useHunter(me.address);

  return (
    <div className="container max-w-4xl py-12">
      <PageHeader
        title="Your dashboard"
        description="Your identity, reputation, and quick actions."
      />

      <div className="mt-8 grid gap-5 md:grid-cols-[20rem_1fr]">
        <IdentityCard me={me} />

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              icon={Coins}
              label="Total earned"
              value={`$${formatUsdc(data?.totalEarnedUsdc ?? "0")}`}
              hint="USDC, all-time"
            />
            <StatCard icon={Trophy} label="Payouts" value={data?.payoutCount ?? 0} />
          </div>

          <div className="rounded-2xl border border-border bg-card/40 p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Quick actions
            </h3>
            <div className="mt-3 grid gap-2">
              <Link
                href={`/hunters/${me.address}`}
                className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-4 py-3 text-sm transition-colors hover:border-primary/40"
              >
                <span className="inline-flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  View public profile
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
              {QUICK.map((q) => (
                <Link
                  key={q.href}
                  href={q.href}
                  className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-4 py-3 text-sm transition-colors hover:border-primary/40"
                >
                  <span className="inline-flex items-center gap-2">
                    <q.icon className="h-4 w-4 text-muted-foreground" />
                    {q.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MePage() {
  return (
    <RequireAuth>
      <MeInner />
    </RequireAuth>
  );
}
