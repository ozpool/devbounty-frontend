"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";

// The GitHub link flow is a full-page redirect, so its result comes back as a
// query param, not a fetch response. On failure the backend redirects to
// `/?github=error&reason=<code>`; we map the code to a human message here.
const ERROR_MESSAGES: Record<string, string> = {
  already_linked: "That GitHub account is already linked to a different wallet.",
  wallet_already_linked: "This wallet is already linked to a different GitHub account.",
  link_failed: "We couldn't link your GitHub account. Please try again.",
};

/** Surfaces GitHub-link failures (rendered globally from the root layout). */
export function GithubLinkToast() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const handled = React.useRef(false);

  React.useEffect(() => {
    if (handled.current || params.get("github") !== "error") return;
    handled.current = true; // guard against React 18 double-invoke in dev
    const reason = params.get("reason") ?? "";
    toast.error(
      "GitHub link failed",
      ERROR_MESSAGES[reason] ?? ERROR_MESSAGES.link_failed,
    );
    // Drop the params so a refresh or back-nav doesn't re-fire the toast.
    router.replace(window.location.pathname);
  }, [params, router, toast]);

  return null;
}
