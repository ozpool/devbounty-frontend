"use client";

import { Github } from "lucide-react";
import { AddressAvatar } from "@/components/wallet/address-avatar";
import { Badge } from "@/components/ui/badge";
import { GithubLinkButton } from "@/components/auth/github-link-button";
import { GithubUnlinkButton } from "@/components/auth/github-unlink-button";
import { GithubSwitchButton } from "@/components/auth/github-switch-button";
import { shortAddress } from "@/lib/utils";
import type { Me } from "@/lib/types";

export function IdentityCard({ me }: { me: Me }) {
  return (
    <div className="ring-gradient rounded-2xl border border-border bg-card/40 p-5">
      <div className="flex items-center gap-3">
        <AddressAvatar address={me.address} size={44} />
        <div>
          <p className="font-mono text-sm">{shortAddress(me.address, 6)}</p>
          <Badge
            tone={me.role === "maintainer" ? "secondary" : "primary"}
            className="mt-1"
          >
            {me.role}
          </Badge>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm text-muted-foreground">GitHub</span>
        {me.hasLinkedGithub ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge tone="success">
              <Github className="h-3 w-3" />
              {me.githubLogin}
            </Badge>
            <GithubSwitchButton />
            <GithubUnlinkButton />
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <GithubLinkButton size="sm" />
            <a
              href="https://github.com/logout"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Wrong account? Sign out of GitHub
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
