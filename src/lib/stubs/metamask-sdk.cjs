/**
 * Empty stand-in for `@metamask/sdk`, aliased in next.config.mjs under Turbopack.
 *
 * The real package ships prebuilt ESM with Webpack "magic comments" that
 * Turbopack cannot parse, which 500s every route. RainbowKit pulls the SDK into
 * the build graph through its wallet barrel even though we do not offer the
 * dedicated MetaMask connector (see src/lib/wagmi.ts — the wallet list omits
 * `metaMaskWallet`). Because nothing ever instantiates the SDK, resolving it to
 * this empty CommonJS module lets the graph build while changing no runtime
 * behaviour: MetaMask still connects via the injected and WalletConnect paths.
 *
 * CommonJS so named imports interop to `undefined` instead of failing the build
 * with "export not found".
 */
module.exports = {};
