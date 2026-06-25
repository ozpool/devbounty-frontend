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

// Same-site API proxy. The frontend (vercel.app) and backend (onrender.com) are
// different sites, so the session cookie would be a third-party cookie — which
// Brave/Safari block and Chrome is phasing out, breaking cookie auth. Proxying
// the API under our own origin makes that cookie first-party, so login and the
// GitHub OAuth navigation work in every browser. Override the target per
// environment with BACKEND_ORIGIN; defaults to the deployed Render service.
const BACKEND_ORIGIN =
  process.env.BACKEND_ORIGIN || "https://devbounty-backend.onrender.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_ORIGIN}/:path*` }];
  },
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
  // `next build` uses Webpack (the turbo alias above only applies to `next dev
  // --turbo`), so silence the same optional-dependency warnings here. Both are
  // pulled in transitively by the wallet stack but only used in environments we
  // don't target: `async-storage` is React Native's store (MetaMask SDK) and
  // `pino-pretty` is a dev-only log formatter (WalletConnect's pino logger).
  // Aliasing to `false` resolves each to an empty module.
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };
    return config;
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
