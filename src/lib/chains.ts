import { arbitrumSepolia } from "viem/chains";

// Network support is owned by the wagmi config (chains: [arbitrumSepolia]) and
// surfaced via RainbowKit's `chain.unsupported` + WrongNetworkBanner. These
// helpers only build explorer links.

export const explorerTxUrl = (txHash: string) =>
  `${arbitrumSepolia.blockExplorers.default.url}/tx/${txHash}`;

export const explorerAddressUrl = (address: string) =>
  `${arbitrumSepolia.blockExplorers.default.url}/address/${address}`;
