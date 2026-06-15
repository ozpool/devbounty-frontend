"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { RequireAuth } from "@/components/auth/require-auth";
import { PageHeader } from "@/components/common/page-header";
import { IdentityCard } from "@/components/dashboard/identity-card";
import { ReposPanel } from "@/components/dashboard/repos-panel";
import { buttonVariants } from "@/components/ui/button-variants";
import { useSessionStore } from "@/store/session";
import { cn } from "@/lib/utils";

function DashboardInner() {
  const me = useSessionStore((s) => s.me)!;

  return (
    <div className="container max-w-4xl py-12">
      <PageHeader
        title="Maintainer dashboard"
        description="Fund bounties on issues in repositories you maintain."
        action={
          <Link href="/dashboard/new" className={cn(buttonVariants())}>
            <Plus className="h-4 w-4" />
            Post a bounty
          </Link>
        }
      />

      <div className="mt-8 grid gap-5 md:grid-cols-[20rem_1fr]">
        <IdentityCard me={me} />
        <div>
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Your repositories
          </h2>
          <ReposPanel linked={me.hasLinkedGithub} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardInner />
    </RequireAuth>
  );
}
