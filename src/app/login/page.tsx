"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Github, PenLine, Wallet } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { WalletAuth } from "@/components/wallet/wallet-auth";
import { Badge } from "@/components/ui/badge";
import { useSessionStore } from "@/store/session";
import { safeNextPath } from "@/lib/utils";

const STEPS = [
  { icon: Wallet, label: "Connect your wallet" },
  { icon: PenLine, label: "Sign a gasless message to prove ownership" },
  { icon: Github, label: "Link GitHub to claim bounties" },
];

function LoginInner() {
  const status = useSessionStore((s) => s.status);
  const router = useRouter();
  const params = useSearchParams();
  const justLinked = params.get("github") === "linked";

  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace(safeNextPath(params.get("next")));
    }
  }, [status, router, params]);

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="ring-gradient glass w-full max-w-md rounded-2xl p-8"
      >
        <Logo />
        <h1 className="mt-6 font-display text-2xl font-bold">Sign in to DevBounty</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your wallet is your identity. No passwords, no email.
        </p>

        {justLinked && (
          <Badge tone="success" className="mt-4">
            <Check className="h-3.5 w-3.5" />
            GitHub linked
          </Badge>
        )}

        <ol className="mt-8 space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.label} className="flex items-center gap-3 text-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-4 w-4" />
              </span>
              <span className="text-muted-foreground">
                <span className="mr-2 font-mono text-xs text-foreground/60">
                  0{i + 1}
                </span>
                {s.label}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-8 [&_button]:w-full">
          <WalletAuth />
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginInner />
    </React.Suspense>
  );
}
