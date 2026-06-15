"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { authApi } from "@/lib/api";
import { useSessionStore } from "@/store/session";

/**
 * SIWE sign-in. Assumes a wallet is already connected (RainbowKit handles the
 * connect step). Flow: nonce -> build EIP-4361 message -> sign -> verify, which
 * sets the httpOnly session cookie. Then refresh the session store + /me cache.
 */
export function useSiweLogin() {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const setMe = useSessionStore((s) => s.setMe);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!address || !chainId) throw new Error("Connect a wallet first.");

      const { nonce } = await authApi.nonce(address);
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in to DevBounty. This request will not cost gas.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      }).prepareMessage();

      const signature = await signMessageAsync({ message });
      const { user } = await authApi.verify(message, signature);
      return user;
    },
    onSuccess: (user) => {
      setMe(user);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
