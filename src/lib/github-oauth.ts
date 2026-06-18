/**
 * Shared pieces of the GitHub-link flow used by the link/switch buttons, the
 * OAuth completion page, and the dashboard listener.
 *
 * The flow opens GitHub in a separate tab so the dashboard stays put. When it
 * finishes, the backend redirects that tab to `/oauth/github/complete`, which
 * announces the outcome on a BroadcastChannel and closes itself (or navigates
 * to the dashboard when it can't close).
 *
 * Why BroadcastChannel and not window.opener/postMessage: GitHub serves its
 * authorize page with `Cross-Origin-Opener-Policy: same-origin`, which severs
 * `window.opener` after the cross-origin hop (notably on iOS/WebKit). A
 * same-origin BroadcastChannel doesn't depend on the opener link, so the
 * dashboard reliably hears the result even on mobile.
 */
export const OAUTH_CHANNEL = "devbounty-github-oauth";

/** Reused so repeated clicks reuse the same tab instead of stacking new ones. */
export const OAUTH_WINDOW_NAME = "devbounty-github-oauth";

export type GithubLinkStatus = "linked" | "error";

export interface GithubLinkResult {
  status: GithubLinkStatus;
  reason?: string;
}

// Reason codes the backend can send on failure → human copy. Kept in one place
// so the completion page, the dashboard listener, and the fallback toast agree.
const ERROR_MESSAGES: Record<string, string> = {
  already_linked: "That GitHub account is already linked to a different wallet.",
  wallet_already_linked: "This wallet is already linked to a different GitHub account.",
  denied: "GitHub authorization was cancelled.",
  state_invalid:
    "The link request expired or didn't match this browser. Please try again.",
  invalid_request: "Something went wrong starting the link. Please try again.",
  link_failed: "We couldn't link your GitHub account. Please try again.",
};

export function githubLinkErrorMessage(reason?: string | null): string {
  return (reason && ERROR_MESSAGES[reason]) || ERROR_MESSAGES.link_failed;
}

/** Narrow an arbitrary BroadcastChannel payload to our result shape. */
export function isGithubLinkResult(data: unknown): data is GithubLinkResult {
  if (typeof data !== "object" || data === null) return false;
  const status = (data as { status?: unknown }).status;
  return status === "linked" || status === "error";
}

/** Announce the link outcome to any open dashboard tab on this origin. */
export function broadcastGithubLink(result: GithubLinkResult): void {
  if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
  const channel = new BroadcastChannel(OAUTH_CHANNEL);
  channel.postMessage(result);
  channel.close();
}

/**
 * Start the GitHub OAuth flow in a new tab. If the browser blocks the popup
 * (returns null), fall back to a same-tab navigation so the flow still
 * completes — that path lands back on the dashboard via a query param.
 */
export function openGithubOAuth(url: string): void {
  const win = window.open(url, OAUTH_WINDOW_NAME);
  if (!win) {
    window.location.href = url;
    return;
  }
  win.focus();
}
