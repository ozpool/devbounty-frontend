"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GitMerge, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: EASE },
});

export function Hero() {
  return (
    <section className="relative">
      <div className="container grid items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div>
          <motion.div {...rise(0)}>
            <Badge tone="primary" className="mb-5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Live on Arbitrum Sepolia
            </Badge>
          </motion.div>

          <motion.h1
            {...rise(0.06)}
            className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Bug bounties that pay the{" "}
            <span className="text-gradient">moment a fix is merged</span>.
          </motion.h1>

          <motion.p
            {...rise(0.12)}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Sponsors lock USDC in non-custodial escrow. Hunters claim, fix, and open a
            pull request. When a maintainer merges, funds release on-chain —
            automatically. No invoices, no ghosting, no 8% fees.
          </motion.p>

          <motion.div {...rise(0.18)} className="mt-8 flex flex-wrap gap-3">
            <Link href="/bounties" className={cn(buttonVariants({ size: "lg" }))}>
              Browse bounties
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard/new"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Post a bounty
            </Link>
          </motion.div>

          <motion.div
            {...rise(0.24)}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Non-custodial escrow
            </span>
            <span className="inline-flex items-center gap-2">
              <GitMerge className="h-4 w-4 text-primary" />
              Paid on merge
            </span>
            <span className="inline-flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Settles in seconds
            </span>
          </motion.div>
        </div>

        <HeroCard />
      </div>
    </section>
  );
}

/** Decorative, realistic-looking bounty card that floats beside the headline. */
function HeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="ring-gradient glass animate-float rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <Badge tone="success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Open
          </Badge>
          <span className="font-mono text-xs text-muted-foreground">arb-sepolia</span>
        </div>

        <p className="mt-4 font-mono text-xs text-muted-foreground">
          octo/payments-sdk · #482
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold leading-snug">
          Race condition in webhook signature verification
        </h3>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Reward</p>
            <p className="font-display text-3xl font-bold text-primary">
              $1,200
              <span className="ml-1 text-sm font-medium text-muted-foreground">
                USDC
              </span>
            </p>
          </div>
          <Badge tone="secondary">TypeScript</Badge>
        </div>

        <div className="mt-5 h-px bg-border" />
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Refunds in 14d if unclaimed</span>
          <span className="inline-flex items-center gap-1.5 text-primary">
            Claim <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>

      <div className="absolute -right-6 -top-6 -z-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-8 -left-6 -z-10 h-40 w-40 rounded-full bg-secondary/20 blur-3xl" />
    </motion.div>
  );
}
