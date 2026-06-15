import {
  Coins,
  FileLock2,
  GitPullRequestArrow,
  ShieldCheck,
  Trophy,
  Undo2,
} from "lucide-react";
import { Reveal, Stagger, MotionItem, staggerItem } from "@/components/motion";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Non-custodial escrow",
    body: "USDC sits in an audited contract on Arbitrum. Payouts follow a rule, not a company’s discretion.",
  },
  {
    icon: GitPullRequestArrow,
    title: "Paid on merge",
    body: "A signed GitHub webhook is the only trigger. Merge the fix, the hunter gets paid — no manual release.",
  },
  {
    icon: Trophy,
    title: "Reputation & leaderboard",
    body: "Every on-chain payout builds a public, tamper-proof hunter profile and language-ranked leaderboard.",
  },
  {
    icon: Undo2,
    title: "Automatic refunds",
    body: "If no acceptable PR lands inside the refund window, the sponsor reclaims their USDC in one click.",
  },
  {
    icon: FileLock2,
    title: "On-chain audit trail",
    body: "Each release records the merge commit on-chain. Even the operator can’t rewrite who got paid.",
  },
  {
    icon: Coins,
    title: "Zero platform fees",
    body: "Hunters keep the full bounty. No 8% processor cut, no currency conversion losses, no wire delays.",
  },
];

export function Features() {
  return (
    <section className="container py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Built for trustless payouts
        </h2>
        <p className="mt-4 text-muted-foreground">
          The chain holds custody and the audit trail. Everything else stays fast and
          off-chain.
        </p>
      </Reveal>

      <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <MotionItem key={f.title} variants={staggerItem}>
            <div className="group h-full rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-primary/40">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          </MotionItem>
        ))}
      </Stagger>
    </section>
  );
}
