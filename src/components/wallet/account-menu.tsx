"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Github,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { useDisconnect } from "wagmi";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useLogout } from "@/hooks/use-logout";
import { AddressAvatar } from "./address-avatar";
import { Badge } from "@/components/ui/badge";
import { authApi } from "@/lib/api";
import { explorerAddressUrl } from "@/lib/chains";
import { shortAddress } from "@/lib/utils";
import type { Me } from "@/lib/types";

const itemCls =
  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground";

export function AccountMenu({ address, me }: { address: string; me: Me | null }) {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const { disconnect } = useDisconnect();
  const logout = useLogout();

  // Move focus into the menu on open.
  React.useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus(),
    );
    return () => cancelAnimationFrame(id);
  }, [open]);

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
    if (!items?.length) return;
    const arr = Array.from(items);
    const idx = arr.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      arr[(idx + 1) % arr.length].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      arr[(idx - 1 + arr.length) % arr.length].focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      arr[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      arr[arr.length - 1].focus();
    } else if (e.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const signOut = () => {
    logout.mutate();
    disconnect();
    setOpen(false);
  };

  const close = () => setOpen(false);

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="account-menu"
        className="flex items-center gap-2 rounded-full border border-border bg-card/60 py-1 pl-1 pr-2.5 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <AddressAvatar address={address} />
        <span className="font-mono text-xs">{shortAddress(address)}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="account-menu"
            role="menu"
            aria-label="Account menu"
            onKeyDown={onMenuKeyDown}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="glass absolute right-0 z-50 mt-2 w-64 rounded-lg p-1.5 shadow-2xl"
          >
            <div className="px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs">{shortAddress(address, 6)}</span>
                <button
                  onClick={copy}
                  className="rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Copy wallet address"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge tone={me?.role === "maintainer" ? "secondary" : "primary"}>
                  {me?.role ?? "guest"}
                </Badge>
                {me?.hasLinkedGithub && (
                  <Badge tone="success">
                    <Github className="h-3 w-3" />
                    {me.githubLogin}
                  </Badge>
                )}
              </div>
            </div>

            <div className="my-1 h-px bg-border" />

            <Link
              href="/me"
              role="menuitem"
              tabIndex={-1}
              className={itemCls}
              onClick={close}
            >
              <LayoutDashboard className="h-4 w-4" />
              My dashboard
            </Link>
            <Link
              href={`/hunters/${address}`}
              role="menuitem"
              tabIndex={-1}
              className={itemCls}
              onClick={close}
            >
              <User className="h-4 w-4" />
              Public profile
            </Link>
            <a
              href={explorerAddressUrl(address)}
              target="_blank"
              rel="noreferrer"
              role="menuitem"
              tabIndex={-1}
              className={itemCls}
            >
              <ExternalLink className="h-4 w-4" />
              View on explorer
            </a>
            {me && !me.hasLinkedGithub && (
              <button
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  window.location.href = authApi.githubStartUrl();
                }}
                className={itemCls}
              >
                <Github className="h-4 w-4" />
                Link GitHub
              </button>
            )}

            <div className="my-1 h-px bg-border" />

            <button
              role="menuitem"
              tabIndex={-1}
              onClick={signOut}
              className={`${itemCls} hover:text-danger focus:text-danger`}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
