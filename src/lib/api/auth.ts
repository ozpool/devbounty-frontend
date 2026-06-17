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

  /** Full-page redirect into the GitHub OAuth linking flow. Pass `switch: true`
   *  to force GitHub's account chooser instead of silently reusing the session. */
  githubStartUrl: (opts?: { switch?: boolean }) =>
    `${env.apiBaseUrl}/auth/github/start${opts?.switch ? "?switch=1" : ""}`,

  /** Unlink the GitHub account from the current wallet. In-flight claims are
   *  unaffected (they snapshot the GitHub identity at submit time). */
  unlinkGithub: () =>
    apiFetch<{ unlinked: boolean }>("/auth/github/link", { method: "DELETE" }),
};
