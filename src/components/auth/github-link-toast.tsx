"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { githubLinkErrorMessage } from "@/lib/github-oauth";

/**
 * Surfaces the GitHub-link result on the same-tab fallback path (when the popup
 * was blocked, the flow lands here via `?github=linked|error`). The popup path
 * reports back through GithubLinkBridge instead, so this only fires on the
 * fallback. Rendered globally from the root layout.
 */
export function GithubLinkToast() {
  const params = useSearchParams();
  const router = useRouter();
  const qc = useQueryClient();
  const toast = useToast();
  const handled = React.useRef(false);

  React.useEffect(() => {
    const result = params.get("github");
    if (handled.current || (result !== "linked" && result !== "error")) return;
    handled.current = true; // guard against React 18 double-invoke in dev

    if (result === "linked") {
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("GitHub linked", "You can now claim bounties.");
    } else {
      toast.error("GitHub link failed", githubLinkErrorMessage(params.get("reason")));
    }
    // Drop the params so a refresh or back-nav doesn't re-fire the toast.
    router.replace(window.location.pathname);
  }, [params, router, qc, toast]);

  return null;
}
