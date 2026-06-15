import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export function FinalCta() {
  return (
    <section className="container py-20">
      <Reveal>
        <div className="ring-gradient relative overflow-hidden rounded-3xl border border-border bg-card/40 px-6 py-16 text-center sm:px-12">
          <div className="absolute inset-0 -z-10 bg-radial-fade" />
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to ship fixes and get paid?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Connect a wallet, link GitHub, and claim your first bounty — or fund one and
            let the merge do the rest.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/bounties" className={cn(buttonVariants({ size: "lg" }))}>
              Explore bounties
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/leaderboard"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              See the leaderboard
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
