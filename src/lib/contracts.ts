import { erc20Abi } from "viem";
import { bountyEscrowAbi } from "@/abi/bountyEscrow";
import { env, isEscrowConfigured } from "./env";

/** USDC (Circle native) uses 6 decimals on Arbitrum. */
export const USDC_DECIMALS = 6;

/** The deployed BountyEscrow, or null if no valid escrow address is configured. */
export const escrowContract = isEscrowConfigured
  ? ({ address: env.escrowAddress as `0x${string}`, abi: bountyEscrowAbi } as const)
  : null;

export const usdcContract = {
  address: env.usdcAddress,
  abi: erc20Abi,
} as const;

export { bountyEscrowAbi, erc20Abi, isEscrowConfigured };
