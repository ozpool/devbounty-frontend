"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Info, Trash2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { isUserRejection, useRefundBounty } from "@/hooks/use-escrow";
import { bountiesApi, ApiError } from "@/lib/api";
import { isEscrowConfigured } from "@/lib/contracts";
import { timeAgo } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import type { BountyDetail } from "@/lib/types";

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5">
      <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        You own this bounty
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function MaintainerPanel({ bounty }: { bounty: BountyDetail }) {
  const { refund, isPending } = useRefundBounty();
  const toast = useToast();
  const router = useRouter();
  const [recording, setRecording] = React.useState(false);
  const [cancelling, setCancelling] = React.useState(false);

  const elig = useQuery({
    queryKey: ["refund-eligibility", bounty.bountyId],
    queryFn: () => bountiesApi.refundEligibility(bounty.bountyId),
    enabled: isEscrowConfigured && bounty.lifecycleStatus === "open",
    retry: 0,
  });

  const onCancel = async () => {
    setCancelling(true);
    try {
      await bountiesApi.cancel(bounty.bountyId);
      toast.success("Bounty cancelled", "It was never funded, so nothing was charged.");
      router.refresh();
    } catch (e) {
      toast.error("Couldn't cancel", e instanceof ApiError ? e.message : "Try again.");
    } finally {
      setCancelling(false);
    }
  };

  // An unfunded bounty has no on-chain escrow, so the only action is to cancel it.
  if (bounty.lifecycleStatus === "pending_deposit") {
    return (
      <Wrap>
        <p className="text-sm text-muted-foreground">
          This bounty hasn&apos;t been funded yet. You can cancel it to remove it from the
          board — no USDC was charged.
        </p>
        <Button
          variant="outline"
          className="mt-4 w-full"
          disabled={cancelling}
          onClick={onCancel}
        >
          {cancelling ? <Spinner /> : <Trash2 className="h-4 w-4" />}
          Cancel bounty
        </Button>
      </Wrap>
    );
  }

  // Contract not deployed yet — funding/refund happen on-chain from the wallet.
  if (!isEscrowConfigured) {
    return (
      <Wrap>
        <p className="text-sm text-muted-foreground">
          Funding and refunds are signed from your wallet on-chain. The escrow contract
          isn&apos;t deployed yet, so those actions unlock once it is.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          Refund &amp; release become available after contract deploy.
        </div>
      </Wrap>
    );
  }

  const onRefund = async () => {
    try {
      const hash = await refund(bounty.bountyId as `0x${string}`);
      setRecording(true);
      const synced = await bountiesApi
        .refundRecorded(bounty.bountyId, hash)
        .then(() => true)
        .catch((err) => {
          console.error("refund sync failed", err);
          return false;
        });
      if (synced) {
        toast.success("Refund sent", "Your USDC is on its way back.");
      } else {
        toast.info(
          "Refund sent on-chain",
          "Server sync failed — reload in a moment for updated status.",
        );
      }
    } catch (e) {
      if (isUserRejection(e)) {
        toast.info("Cancelled", "You dismissed the wallet request.");
      } else {
        toast.error(
          "Refund failed",
          e instanceof ApiError ? e.message : "The transaction failed.",
        );
      }
    } finally {
      setRecording(false);
    }
  };

  const eligible = elig.data?.eligible;
  const busy = isPending || recording;

  return (
    <Wrap>
      {bounty.lifecycleStatus !== "open" ? (
        <p className="text-sm text-muted-foreground">
          This bounty is {bounty.lifecycleStatus.replace("_", " ")}. No refund action is
          available.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            If no acceptable PR arrives, you can reclaim the escrowed USDC after the
            refund window.
          </p>
          <Button
            variant="outline"
            className="mt-4 w-full"
            disabled={!eligible || busy}
            onClick={onRefund}
          >
            {busy ? <Spinner /> : <Undo2 className="h-4 w-4" />}
            Refund bounty
          </Button>
          {!eligible && elig.data?.windowExpiresAt && (
            <p className="mt-2 text-xs text-muted-foreground">
              Refundable {timeAgo(elig.data.windowExpiresAt)}.
            </p>
          )}
        </>
      )}
    </Wrap>
  );
}
