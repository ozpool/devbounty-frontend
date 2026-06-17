"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { authApi } from "@/lib/api";

/**
 * Unlink the connected GitHub account, with an inline confirm step (no modal).
 * Bounties the wallet has already claimed still pay out — they snapshot the
 * GitHub identity at submit time — and the confirm copy says so, so unlinking
 * never feels like it risks a pending reward.
 */
export function GithubUnlinkButton() {
  const qc = useQueryClient();
  const toast = useToast();
  const [confirming, setConfirming] = React.useState(false);

  const unlink = useMutation({
    mutationFn: () => authApi.unlinkGithub(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success(
        "GitHub unlinked",
        "Link a GitHub account again to claim bounties.",
      );
      setConfirming(false);
    },
    onError: () => toast.error("Couldn't unlink GitHub", "Please try again."),
  });

  if (!confirming) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
        <Unlink className="h-3.5 w-3.5" />
        Unlink
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <span className="text-xs text-muted-foreground">
        Unlink? Bounties you&apos;ve already claimed still pay out.
      </span>
      <Button
        variant="danger"
        size="sm"
        onClick={() => unlink.mutate()}
        disabled={unlink.isPending}
      >
        {unlink.isPending ? "Unlinking…" : "Confirm"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setConfirming(false)}
        disabled={unlink.isPending}
      >
        Cancel
      </Button>
    </div>
  );
}
