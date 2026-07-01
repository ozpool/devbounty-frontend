import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/motion";
import { WpSection } from "@/components/whitepaper/wp-section";
import { WpTocRail } from "@/components/whitepaper/wp-toc-rail";
import { SECTIONS } from "./content";

export const metadata: Metadata = {
  title: "Docs - DevBounty White Paper",
  description:
    "The DevBounty white paper: a decentralized bug-bounty platform where USDC escrow and a GitHub merge replace the trusted payout custodian.",
};

const VERSION = "v1.0";
const PUBLISHED = "June 2026";

const RAIL_ITEMS = SECTIONS.map((s) => ({ id: s.id, title: s.title }));

export default function WhitePaperPage() {
  return (
    <div className="container py-16">
      {/* Cover */}
      <Reveal className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-primary">
          White Paper
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Trust-minimized bug bounties, settled on-chain
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          How DevBounty replaces the payout custodian with USDC escrow and a GitHub
          merge - so a fixed bug is a paid bug, provably.
        </p>
        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {VERSION} · {PUBLISHED}
        </p>
      </Reveal>

      {/* Sidebar + content */}
      <div className="mt-16 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
        {/* Sticky scroll-spy rail (desktop) */}
        <aside className="hidden lg:block">
          <WpTocRail
            items={RAIL_ITEMS}
            heading="White Paper"
            meta={`${VERSION} · ${PUBLISHED}`}
          />
        </aside>

        <div className="mx-auto w-full max-w-3xl">
          {/* Inline contents (mobile only - the rail covers desktop) */}
          <Reveal className="lg:hidden">
            <nav
              aria-label="Table of contents"
              className="ring-gradient rounded-2xl border border-border bg-card/40 p-6"
            >
              <p className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Contents
              </p>
              <ol className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {SECTIONS.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="group flex items-baseline gap-3 rounded-md py-1 text-sm transition-colors hover:text-foreground"
                    >
                      <span className="font-mono text-xs text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-muted-foreground group-hover:text-foreground">
                        {s.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>

          {/* Body sections */}
          <div className="mt-12 space-y-12 lg:mt-0 [&>*:first-child]:border-t-0 [&>*:first-child]:pt-0">
            {SECTIONS.map((s, i) => (
              <WpSection key={s.id} id={s.id} number={i + 1} title={s.title}>
                {s.body}
              </WpSection>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
