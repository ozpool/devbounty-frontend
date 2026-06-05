import { GitMerge, Search, Wallet } from "lucide-react";
import { Reveal, Stagger, MotionItem, staggerItem } from "@/components/motion";

const STEPS = [
  {
    icon: Wallet,
    title: "Fund a bounty",
    body: "Sponsors pick a GitHub issue and lock USDC into the escrow contract. The money is held by code, not a company.",
  },
  {
    icon: Search,
    title: "Claim & fix",
    body: "Hunters reserve a bounty for 7 days, fix the issue, and open a pull request linked to their wallet.",
  },
  {
    icon: GitMerge,
    title: "Merge to pay",
    body: "When the maintainer merges the PR, the backend releases escrow to the hunter on-chain — automatically.",
  },
];

export function HowItWorks() {
  return (
    <section className="container py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Three steps from issue to payout
        </h2>
        <p className="mt-4 text-muted-foreground">
          No accounts to chase, no payout disputes. The merge is the trigger.
        </p>
      </Reveal>

      <Stagger className="relative mt-14 grid gap-6 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <MotionItem key={s.title} variants={staggerItem}>
            <div className="ring-gradient relative h-full rounded-2xl border border-border bg-card/40 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-sm text-muted-foreground">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          </MotionItem>
        ))}
      </Stagger>
    </section>
  );
}
