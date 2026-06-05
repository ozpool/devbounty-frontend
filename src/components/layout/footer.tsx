import Link from "next/link";
import { Github } from "lucide-react";
import { Logo } from "@/components/brand/logo";

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <nav aria-label={title} className="space-y-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="rounded text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="container grid gap-10 py-14 md:grid-cols-4">
        <div className="space-y-3 md:col-span-2">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Fund and claim open-source bug bounties in USDC, released automatically the
            moment a fix is merged.
          </p>
          <p className="text-xs text-muted-foreground">
            Non-custodial escrow on Arbitrum Sepolia.
          </p>
        </div>
        <FooterCol
          title="Product"
          links={[
            ["Browse bounties", "/bounties"],
            ["Leaderboard", "/leaderboard"],
            ["Post a bounty", "/dashboard/new"],
          ]}
        />
        <FooterCol
          title="Account"
          links={[
            ["Dashboard", "/me"],
            ["Sign in", "/login"],
          ]}
        />
      </div>
      <div className="border-t border-border/40">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <span>© {year} DevBounty · MIT licensed</span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/ozpool/Devbounty-frontend"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
            <span>Built on Arbitrum</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
