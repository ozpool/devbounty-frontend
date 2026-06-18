"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import {
  OAUTH_CHANNEL,
  githubLinkErrorMessage,
  isGithubLinkResult,
} from "@/lib/github-oauth";

/**
 * Listens for the result the GitHub-link tab broadcasts when it finishes. On
 * success it refetches `/me` so the identity card flips to linked without a
 * manual refresh; on failure it shows why. BroadcastChannel is same-origin by
 * spec, so no origin check is needed. Mounted once, globally.
 */
export function GithubLinkBridge() {
  const qc = useQueryClient();
  const toast = useToast();

  React.useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const channel = new BroadcastChannel(OAUTH_CHANNEL);
    channel.onmessage = (e: MessageEvent) => {
      if (!isGithubLinkResult(e.data)) return;
      if (e.data.status === "linked") {
        qc.invalidateQueries({ queryKey: ["me"] });
        toast.success("GitHub linked", "You can now claim bounties.");
      } else {
        toast.error("GitHub link failed", githubLinkErrorMessage(e.data.reason));
      }
    };
    return () => channel.close();
  }, [qc, toast]);

  return null;
}
