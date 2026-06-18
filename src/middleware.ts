import { NextResponse, type NextRequest } from "next/server";

/**
 * Per-request CSP nonce. Next reads the nonce from the request's CSP header and
 * stamps it onto its own inline scripts, so we keep a strict `script-src`
 * (only same-origin chunks + nonced inline) without `unsafe-inline`.
 */
const isDev = process.env.NODE_ENV !== "production";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

const connectSrc = [
  "'self'",
  API_BASE,
  // Repo-id lookup for a manually typed repo hits GitHub's public REST API.
  "https://api.github.com",
  "https://*.alchemy.com",
  "wss://*.alchemy.com",
  "https://*.infura.io",
  "wss://*.infura.io",
  "https://*.walletconnect.com",
  "https://*.walletconnect.org",
  "wss://*.walletconnect.org",
  "https://rpc.walletconnect.com",
  "https://explorer-api.walletconnect.com",
  "https://api.web3modal.org",
  "https://*.web3modal.org",
  "https://*.reown.com",
  "wss://*.reown.com",
  "https://*.arbitrum.io",
].join(" ");

export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  // Dev (Turbopack) does not stamp the nonce onto every async vendor chunk, so a
  // nonce-based script-src silently blocks wagmi/rainbowkit/react-query and the
  // app renders blank. In dev fall back to host-allowlisting; prod stays strict.
  const scriptSrc = isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : `script-src 'self' 'nonce-${nonce}'`;
  const csp = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${connectSrc}`,
    "frame-src 'self' https://*.walletconnect.org https://*.reown.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("content-security-policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.svg|robots.txt|sitemap.xml|manifest.webmanifest).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
