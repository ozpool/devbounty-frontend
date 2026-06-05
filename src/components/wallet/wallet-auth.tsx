"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useQueryClient } from "@tanstack/react-query";
import { LogIn, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { useSiweLogin } from "@/hooks/use-siwe-login";
import { useSessionStore } from "@/store/session";
import { env } from "@/lib/env";
import { demoAuth } from "@/lib/demo/auth";
import { AccountMenu } from "./account-menu";

/**
 * One control covering the full auth ladder:
 * disconnected -> wrong network -> connected-not-signed-in -> signed in.
 *
 * In demo mode there is no real wallet/signature — auth is simulated through
 * `/me`, so we reflect the session directly and skip the connect/sign flow.
 */
export function WalletAuth() {
  const login = useSiweLogin();
  const toast = useToast();
  const queryClient = useQueryClient();
  const me = useSessionStore((s) => s.me);
  const status = useSessionStore((s) => s.status);

  if (env.demoMode) {
    if (status === "authenticated" && me) {
      return <AccountMenu address={me.address} me={me} />;
    }
    if (status === "idle" || status === "loading") {
      return <div className="h-10 w-28" aria-hidden />;
    }
    return (
      <Button
        size="sm"
        onClick={() => {
          demoAuth.setSignedIn(true);
          queryClient.invalidateQueries({ queryKey: ["me"] });
        }}
      >
        <LogIn className="h-4 w-4" />
        Sign in
      </Button>
    );
  }

  const signIn = () =>
    login.mutate(undefined, {
      onSuccess: () => toast.success("Signed in"),
      onError: () => toast.error("Sign-in failed", "The signature was rejected."),
    });

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openChainModal, mounted }) => {
        if (!mounted) return <div className="h-10 w-28" aria-hidden />;

        if (!account || !chain) {
          return (
            <Button onClick={openConnectModal} size="sm">
              <Wallet className="h-4 w-4" />
              Connect
            </Button>
          );
        }

        if (chain.unsupported) {
          return (
            <Button variant="danger" size="sm" onClick={openChainModal}>
              Wrong network
            </Button>
          );
        }

        const signedIn =
          status === "authenticated" &&
          me?.address?.toLowerCase() === account.address.toLowerCase();

        if (!signedIn) {
          return (
            <Button size="sm" onClick={signIn} disabled={login.isPending}>
              {login.isPending ? (
                <>
                  <Spinner />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign in
                </>
              )}
            </Button>
          );
        }

        return <AccountMenu address={account.address} me={me} />;
      }}
    </ConnectButton.Custom>
  );
}
