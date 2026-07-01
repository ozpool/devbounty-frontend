import { BaseError, ContractFunctionRevertedError } from "viem";

/**
 * A user-facing escrow error. Anything wrapped in this already has a clear,
 * safe message to show directly in a toast; anything else is a raw wallet/RPC
 * error the UI should not surface verbatim.
 */
export class EscrowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EscrowError";
  }
}

// The BountyEscrow contract's custom errors, mapped to plain-English copy.
// Mirrors the `error` list in contracts/contracts/BountyEscrow.sol.
const REVERT_MESSAGES: Record<string, string> = {
  NotAuthorized: "Only the DevBounty backend can release this bounty.",
  BountyExists: "This bounty is already funded on-chain.",
  BountyNotOpen: "This bounty is no longer open, so it can't be changed.",
  ZeroAmount: "The reward must be greater than zero.",
  AmountTooLarge: "The reward is larger than the escrow allows.",
  RefundTooEarly: "The refund window hasn't elapsed yet.",
  NotMaintainer: "Only the wallet that funded this bounty can refund it.",
};

/**
 * Turn a viem contract-call error into a human message, or null if it isn't a
 * recognized escrow revert or a known wallet condition. Callers fall back to a
 * generic message when this returns null.
 */
export function decodeEscrowError(e: unknown): string | null {
  if (!(e instanceof BaseError)) return null;

  const revert = e.walk((err) => err instanceof ContractFunctionRevertedError);
  if (revert instanceof ContractFunctionRevertedError) {
    const name = revert.data?.errorName ?? revert.reason ?? "";
    if (name in REVERT_MESSAGES) return REVERT_MESSAGES[name];
  }

  // Not enough native ETH to pay for gas surfaces as a plain message, not a
  // decoded revert, so match it here.
  if (/insufficient funds/i.test(e.message)) {
    return "Not enough ETH to pay gas on Arbitrum Sepolia. Add testnet ETH and try again.";
  }

  return null;
}
