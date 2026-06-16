import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AmbientBackground } from "@/components/layout/ambient-background";
import { WrongNetworkBanner } from "@/components/wallet/wrong-network-banner";
import { Toaster } from "@/components/ui/toast";
import { GithubLinkToast } from "@/components/auth/github-link-toast";
import { DemoBadge } from "@/components/demo-badge";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DevBounty — Open-source bug bounties, paid on merge",
    template: "%s · DevBounty",
  },
  description:
    "Fund open-source bug bounties in USDC held in non-custodial escrow on Arbitrum. Hunters claim, fix, and get paid automatically when the maintainer merges.",
  metadataBase: new URL("https://devbounty.example"),
  openGraph: {
    title: "DevBounty",
    description: "Open-source bug bounties, paid the moment a fix is merged.",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

// Set the theme class before paint to avoid a flash (reads the persisted store).
const noFlash = `(function(){try{var s=JSON.parse(localStorage.getItem('devbounty-theme'));var t=(s&&s.state&&s.state.theme)||'dark';var d=t!=='light';document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = headers().get("x-nonce") ?? undefined;
  return (
    <html
      lang="en"
      className={cn(sans.variable, display.variable, mono.variable, "dark")}
      suppressHydrationWarning
    >
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body>
        <Providers>
          <AmbientBackground />
          <WrongNetworkBanner />
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
          <Toaster />
          <Suspense fallback={null}>
            <GithubLinkToast />
          </Suspense>
          {env.demoMode && <DemoBadge />}
        </Providers>
      </body>
    </html>
  );
}
