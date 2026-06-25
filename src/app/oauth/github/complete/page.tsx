"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import {
  broadcastGithubLink,
  takeGithubReturn,
  type GithubLinkStatus,
} from "@/lib/github-oauth";
import { safeNextPath } from "@/lib/utils";

/**
 * Landing page for the GitHub OAuth tab. The backend redirects here after the
 * link finishes. It announces the result on a BroadcastChannel (so any open
 * dashboard tab updates regardless of opener/COOP), then closes itself. When it
 * can't close — same-tab fallback, or iOS where a script can't close the tab —
 * it navigates to the dashboard, which surfaces the result via the global toast.
 */
function CompleteInner() {
  const params = useSearchParams();
  const router = useRouter();
  const handled = React.useRef(false);

  const githubParam = params.get("github");
  const status: GithubLinkStatus = githubParam === "linked" ? "linked" : "error";
  const reason = params.get("reason") ?? undefined;

  React.useEffect(() => {
    // A direct visit with no params isn't a real outcome — show a neutral state.
    if (handled.current || !githubParam) return;
    handled.current = true;

    broadcastGithubLink({ status, reason });

    // Only a script-opened popup can close itself; everything else (same-tab
    // fallback, iOS) falls through to a dashboard navigation.
    try {
      window.close();
    } catch {
      // ignore — handled by the navigation fallback below
    }
    requestAnimationFrame(() => {
      if (window.closed) return;
      // Return to the page the flow started on; fall back to the dashboard when
      // there's nothing remembered (e.g. a popup that couldn't self-close).
      const target = safeNextPath(takeGithubReturn(), "/dashboard");
      const q = new URLSearchParams({ github: status });
      if (reason) q.set("reason", reason);
      const sep = target.includes("?") ? "&" : "?";
      router.replace(`${target}${sep}${q.toString()}`);
    });
  }, [githubParam, status, reason, router]);

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-16 text-center">
      <div className="ring-gradient glass w-full max-w-sm rounded-2xl p-8">
        <Logo />
        <p className="mt-6 text-sm text-muted-foreground">
          {!githubParam
            ? "Nothing to finish here."
            : status === "linked"
              ? "GitHub linked. Taking you back to where you left off…"
              : "Finishing up. Taking you back to where you left off…"}
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block text-sm text-primary underline-offset-2 hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export default function GithubOAuthCompletePage() {
  return (
    <React.Suspense fallback={null}>
      <CompleteInner />
    </React.Suspense>
  );
}
