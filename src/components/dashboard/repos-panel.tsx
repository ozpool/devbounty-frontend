"use client";

import Link from "next/link";
import { FolderGit2, Lock, Plus } from "lucide-react";
import { GithubLinkButton } from "@/components/auth/github-link-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import { useRepos } from "@/hooks/use-repos";
import { cn } from "@/lib/utils";

export function ReposPanel({ linked }: { linked: boolean }) {
  const { data, isPending, isError } = useRepos(linked);

  if (!linked) {
    return (
      <EmptyState
        icon={Lock}
        title="Link GitHub to continue"
        description="Connect your GitHub account to see the repositories you can fund bounties on."
        action={<GithubLinkButton />}
      />
    );
  }

  if (isPending) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data?.repos?.length) {
    return (
      <EmptyState
        icon={FolderGit2}
        title="No repositories yet"
        description="We couldn't find repos you administer. Once connected, they'll show here ready to fund."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {data.repos.map((r) => (
        <li
          key={r.githubRepoId}
          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/40 px-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{r.fullName}</p>
            <div className="mt-0.5 flex items-center gap-2">
              {r.private && <Badge tone="neutral">private</Badge>}
              {r.hasWebhook && <Badge tone="success">webhook</Badge>}
            </div>
          </div>
          <Link
            href={`/dashboard/new?repo=${encodeURIComponent(r.fullName)}&repoId=${r.githubRepoId}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Plus className="h-4 w-4" />
            Fund
          </Link>
        </li>
      ))}
    </ul>
  );
}
