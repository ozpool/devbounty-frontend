"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useAccount, useSwitchChain } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { Button } from "@/components/ui/button";

/** Sticky warning when the wallet is on a chain other than Arbitrum Sepolia. */
export function WrongNetworkBanner() {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const wrong = isConnected && chainId !== arbitrumSepolia.id;

  return (
    <AnimatePresence>
      {wrong && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden border-b border-warning/30 bg-warning/10"
        >
          <div className="container flex flex-wrap items-center justify-center gap-3 py-2 text-sm text-warning">
            <AlertTriangle className="h-4 w-4" />
            <span>
              You&apos;re on the wrong network. DevBounty runs on Arbitrum Sepolia.
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 border-warning/40 text-warning hover:bg-warning/10"
              disabled={isPending}
              onClick={() => switchChain({ chainId: arbitrumSepolia.id })}
            >
              {isPending ? "Switching…" : "Switch network"}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
