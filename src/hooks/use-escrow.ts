"use client";

import * as React from "react";
import {
  BaseError,
  formatUnits,
  parseUnits,
  UserRejectedRequestError,
  WaitForTransactionReceiptTimeoutError,
  type PublicClient,
} from "viem";
import { arbitrumSepolia } from "viem/chains";
import { useAccount, useChainId, usePublicClient, useWriteContract } from "wagmi";
import { escrowContract, usdcContract, USDC_DECIMALS } from "@/lib/contracts";
import { clampFees } from "@/lib/fees";
import { decodeEscrowError, EscrowError } from "@/lib/escrow-errors";

export type FundStep = "idle" | "approving" | "creating" | "done";

// Pad the chain's gas estimate so the limit still covers the tx if state shifts
// between estimate and mining (e.g. a storage slot going zero->nonzero costs
// more). Without headroom an exact estimate can revert out-of-gas.
const GAS_LIMIT_BUFFER_PERCENT = 25n;
// Stop waiting on a receipt after this long so a stuck tx surfaces a message
// instead of spinning forever.
const RECEIPT_TIMEOUT_MS = 120_000;

const withGasBuffer = (estimate: bigint): bigint =>
  (estimate * (100n + GAS_LIMIT_BUFFER_PERCENT)) / 100n;

/** True when an error is (or wraps) a wallet "user rejected" so callers can
 *  show a neutral "cancelled" message instead of an alarming red failure. */
export function isUserRejection(e: unknown): boolean {
  if (e instanceof BaseError) {
    return Boolean(e.walk((err) => err instanceof UserRejectedRequestError));
  }
  return e instanceof UserRejectedRequestError;
}

/** Wait for one confirmation, but turn a stuck tx into a clear message. */
async function awaitReceipt(client: PublicClient, hash: `0x${string}`): Promise<void> {
  try {
    await client.waitForTransactionReceipt({ hash, timeout: RECEIPT_TIMEOUT_MS });
  } catch (e) {
    if (e instanceof WaitForTransactionReceiptTimeoutError) {
      throw new EscrowError(
        `The transaction was submitted but hasn't confirmed yet. Check your wallet - tx ${hash.slice(0, 10)}…`,
      );
    }
    throw e;
  }
}

/** Convert any thrown error into a user-facing one where we can, else rethrow. */
function asUserFacing(e: unknown): unknown {
  if (isUserRejection(e) || e instanceof EscrowError) return e;
  const decoded = decodeEscrowError(e);
  return decoded ? new EscrowError(decoded) : e;
}

/** Reject early when the wallet is on the wrong chain. */
function assertOnArbitrumSepolia(chainId: number): void {
  if (chainId !== arbitrumSepolia.id) {
    throw new EscrowError(
      "You're on the wrong network. Switch your wallet to Arbitrum Sepolia and try again.",
    );
  }
}

/**
 * Approve (only if allowance is short) then create the bounty on the escrow.
 * Pre-flight checks (chain, USDC balance) and revert decoding mean each failure
 * surfaces a specific reason. Throws if the escrow isn't configured yet.
 */
export function useFundBounty() {
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();
  const { address } = useAccount();
  const chainId = useChainId();
  const [step, setStep] = React.useState<FundStep>("idle");

  const fund = async (bountyId: `0x${string}`, amountUsdc: string) => {
    if (!escrowContract) throw new EscrowError("The escrow contract is not configured.");
    if (!address || !client) throw new EscrowError("Connect your wallet first.");
    assertOnArbitrumSepolia(chainId);

    let amount: bigint;
    try {
      amount = parseUnits(amountUsdc, USDC_DECIMALS);
    } catch {
      throw new EscrowError("Enter a USDC amount with at most 6 decimal places.");
    }

    try {
      const balance = await client.readContract({
        ...usdcContract,
        functionName: "balanceOf",
        args: [address],
      });
      if (balance < amount) {
        throw new EscrowError(
          `Not enough USDC. This bounty needs ${amountUsdc} but your wallet holds ${formatUnits(balance, USDC_DECIMALS)}.`,
        );
      }

      const allowance = await client.readContract({
        ...usdcContract,
        functionName: "allowance",
        args: [address, escrowContract.address],
      });

      if (allowance < amount) {
        setStep("approving");
        const approveGas = withGasBuffer(
          await client.estimateContractGas({
            ...usdcContract,
            functionName: "approve",
            args: [escrowContract.address, amount],
            account: address,
          }),
        );
        // Fresh market fees per send (the base fee can move during the approve
        // wait), clamped to a floor so the tx never underpays and stalls/fails.
        const approveHash = await writeContractAsync({
          ...usdcContract,
          functionName: "approve",
          args: [escrowContract.address, amount],
          gas: approveGas,
          ...clampFees(await client.estimateFeesPerGas()),
        });
        await awaitReceipt(client, approveHash);
      }

      setStep("creating");
      // Estimate after the approve is mined so the allowance check inside
      // create() passes during simulation; estimating earlier would revert.
      const createGas = withGasBuffer(
        await client.estimateContractGas({
          ...escrowContract,
          functionName: "create",
          args: [bountyId, amount],
          account: address,
        }),
      );
      const createHash = await writeContractAsync({
        ...escrowContract,
        functionName: "create",
        args: [bountyId, amount],
        gas: createGas,
        ...clampFees(await client.estimateFeesPerGas()),
      });
      await awaitReceipt(client, createHash);

      setStep("done");
      return createHash;
    } catch (e) {
      setStep("idle");
      throw asUserFacing(e);
    }
  };

  return { fund, step };
}

/** Maintainer-signed refund after the bounty's refund window has elapsed. */
export function useRefundBounty() {
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();
  const { address } = useAccount();
  const chainId = useChainId();
  const [isPending, setPending] = React.useState(false);

  const refund = async (bountyId: `0x${string}`) => {
    if (!escrowContract) throw new EscrowError("The escrow contract is not configured.");
    if (!address || !client) throw new EscrowError("Connect your wallet first.");
    assertOnArbitrumSepolia(chainId);
    setPending(true);
    try {
      const refundGas = withGasBuffer(
        await client.estimateContractGas({
          ...escrowContract,
          functionName: "refund",
          args: [bountyId],
          account: address,
        }),
      );
      const hash = await writeContractAsync({
        ...escrowContract,
        functionName: "refund",
        args: [bountyId],
        gas: refundGas,
        ...clampFees(await client.estimateFeesPerGas()),
      });
      await awaitReceipt(client, hash);
      return hash;
    } catch (e) {
      throw asUserFacing(e);
    } finally {
      setPending(false);
    }
  };

  return { refund, isPending };
}
