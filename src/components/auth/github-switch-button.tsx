"use client";

import { useMutation } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { authApi } from "@/lib/api";
import { openGithubOAuth, OAUTH_WINDOW_NAME } from "@/lib/github-oauth";

/**
 * Switch the linked GitHub account in one click: unlink here, then send the user
 * to GitHub's authorize screen (forcing its account screen). GitHub has no
 * in-app account picker, so if the wrong account still appears the user must
 * sign out of GitHub (the identity card links to it) and link again.
 *
 * The tab is opened synchronously in the click handler — browsers block popups
 * opened later (e.g. inside the async unlink callback), so opening up front
 * keeps the user's gesture and only navigates it to GitHub once the unlink has
 * cleared the old account. If unlink fails, the tab is closed.
 */
export function GithubSwitchButton() {
  const toast = useToast();
  const swap = useMutation({
    mutationFn: () => authApi.unlinkGithub(),
    onError: () => toast.error("Couldn't start the switch", "Please try again."),
  });

  function onSwitch() {
    const url = authApi.githubStartUrl({ switch: true });
    const win = window.open("about:blank", OAUTH_WINDOW_NAME);
    swap.mutate(undefined, {
      onSuccess: () => {
        if (win && !win.closed) win.location.href = url;
        else openGithubOAuth(url); // popup blocked → same-tab fallback
      },
      onError: () => {
        if (win && !win.closed) win.close();
      },
    });
  }

  return (
    <Button variant="ghost" size="sm" onClick={onSwitch} disabled={swap.isPending}>
      <RefreshCw className="h-3.5 w-3.5" />
      {swap.isPending ? "Switching…" : "Switch"}
    </Button>
  );
}
