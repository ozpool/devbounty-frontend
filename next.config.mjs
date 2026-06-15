/**
 * Static security headers. The Content-Security-Policy lives in middleware.ts
 * instead, because it carries a per-request nonce so Next's inline hydration
 * scripts run under a strict `script-src` (no 'unsafe-inline').
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compile only the icons/components actually used from these large libraries
  // instead of the whole package — faster dev compiles and a smaller build.
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
    turbo: {
      // RainbowKit's wallet barrel drags `@metamask/sdk` into the build graph.
      // Its prebuilt ESM uses Webpack magic comments Turbopack cannot parse, so
      // it 500s every route. We do not offer the MetaMask connector (wagmi.ts
      // omits `metaMaskWallet`), so the SDK is never instantiated — resolve it
      // to an empty stub to let Turbopack build without changing behaviour.
      resolveAlias: {
        "@metamask/sdk": "./src/lib/stubs/metamask-sdk.cjs",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
