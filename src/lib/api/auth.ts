import { apiFetch } from "./client";
import { env } from "@/lib/env";
import type { Me } from "@/lib/types";

export const authApi = {
  /** Get a SIWE nonce; the backend also sets a short-lived nonce cookie. */
  nonce: (address: string) =>
    apiFetch<{ nonce: string }>("/auth/siwe/nonce", {
      method: "POST",
      body: { address },
    }),

  /** Verify the signed SIWE message; sets the session cookie on success. */
  verify: (message: string, signature: string) =>
    apiFetch<{ user: Me }>("/auth/siwe/verify", {
      method: "POST",
      body: { message, signature },
    }),

  logout: () => apiFetch<{ ok: true }>("/auth/logout", { method: "POST" }),

  me: () => apiFetch<Me>("/me"),

  /** Full-page redirect into the GitHub OAuth linking flow. */
  githubStartUrl: () => `${env.apiBaseUrl}/auth/github/start`,
};
