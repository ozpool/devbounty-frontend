"use client";

import * as React from "react";
import { BaseError, parseUnits, UserRejectedRequestError } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { escrowContract, usdcContract, USDC_DECIMALS } from "@/lib/contracts";
import { clampFees } from "@/lib/fees";

export type FundStep = "idle" | "approving" | "creating" | "done";

// Pad the chain's gas estimate so the limit still covers the tx if state shifts
// between estimate and mining (e.g. a storage slot going zero->nonzero costs
// more). Without headroom an exact estimate can revert out-of-gas.
const GAS_LIMIT_BUFFER_PERCENT = 25n;

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

/**
 * Approve (only if allowance is short) then create the bounty on the escrow.
 * Each write waits for one confirmation before moving on. Throws if the escrow
 * isn't configured yet — callers gate on `isEscrowConfigured`.
 */
export function useFundBounty() {
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();
  const { address } = useAccount();
  const [step, setStep] = React.useState<FundStep>("idle");

  const fund = async (bountyId: `0x${string}`, amountUsdc: string) => {
    if (!escrowContract) throw new Error("Escrow contract is not configured.");
    if (!address || !client) throw new Error("Connect a wallet first.");

    const amount = parseUnits(amountUsdc, USDC_DECIMALS);
    try {
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
        await client.waitForTransactionReceipt({ hash: approveHash });
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
      await client.waitForTransactionReceipt({ hash: createHash });

      setStep("done");
      return createHash;
    } catch (e) {
      setStep("idle");
      throw e;
    }
  };

  return { fund, step };
}

/** Maintainer-signed refund after the bounty's refund window has elapsed. */
export function useRefundBounty() {
  const { writeContractAsync } = useWriteContract();
  const client = usePublicClient();
  const { address } = useAccount();
  const [isPending, setPending] = React.useState(false);

  const refund = async (bountyId: `0x${string}`) => {
    if (!escrowContract) throw new Error("Escrow contract is not configured.");
    if (!address || !client) throw new Error("Connect a wallet first.");
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
      await client.waitForTransactionReceipt({ hash });
      return hash;
    } finally {
      setPending(false);
    }
  };

  return { refund, isPending };
}
