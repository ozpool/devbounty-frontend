import { Reveal } from "@/components/motion";

const STATS = [
  { value: "0%", label: "Platform fees" },
  { value: "7 days", label: "Claim reservation" },
  { value: "100%", label: "On-chain payouts" },
  { value: "USDC", label: "Settled in stablecoin" },
];

export function StatStrip() {
  return (
    <section className="border-y border-border/60 bg-card/30">
      <Reveal className="container grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
