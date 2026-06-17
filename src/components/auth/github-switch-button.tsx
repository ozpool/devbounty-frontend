"use client";

import { useMutation } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { authApi } from "@/lib/api";

/**
 * Switch the linked GitHub account in one click: unlink here, then redirect to
 * GitHub's authorize screen forcing its account screen. GitHub has no in-app
 * account picker, so if the wrong account still appears the user must sign out of
 * GitHub (the identity card links to it) and link again.
 */
export function GithubSwitchButton() {
  const toast = useToast();
  const swap = useMutation({
    mutationFn: () => authApi.unlinkGithub(),
    onSuccess: () => {
      window.location.href = authApi.githubStartUrl({ switch: true });
    },
    onError: () => toast.error("Couldn't start the switch", "Please try again."),
  });

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => swap.mutate()}
      disabled={swap.isPending}
    >
      <RefreshCw className="h-3.5 w-3.5" />
      {swap.isPending ? "Switching…" : "Switch"}
    </Button>
  );
}
