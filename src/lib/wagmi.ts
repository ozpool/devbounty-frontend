import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  injectedWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { http } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { env } from "./env";

/**
 * wagmi + RainbowKit config. `ssr: true` lets the App Router hydrate wallet
 * state without a flash. Injected/browser wallets work without a WalletConnect
 * id; the placeholder only keeps the WC connector from throwing at init —
 * set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID for real WalletConnect support.
 *
 * The wallet list is set explicitly instead of using RainbowKit's default,
 * which pulls in `@metamask/sdk`. That package ships webpack "magic comments"
 * Turbopack cannot parse, which 500s every route under `next dev --turbo`.
 * `injectedWallet` still detects and labels the MetaMask browser extension, and
 * mobile MetaMask connects via WalletConnect, so no real capability is lost.
 */
export const wagmiConfig = getDefaultConfig({
  appName: "DevBounty",
  projectId: env.walletConnectProjectId || "00000000000000000000000000000000",
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(env.rpcUrl || undefined),
  },
  wallets: [
    {
      groupName: "Popular",
      wallets: [
        injectedWallet,
        rainbowWallet,
        coinbaseWallet,
        walletConnectWallet,
        safeWallet,
      ],
    },
  ],
  ssr: true,
});
