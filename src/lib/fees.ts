// Market-tracking EIP-1559 fees with a floor. A transaction must never underpay
// the base fee — that's what makes approve/create silently fail — yet we also
// don't want to hardcode a fee. So each send pulls the live estimate from the
// chain and clamps it up to a configurable minimum. Defaults suit Arbitrum
// Sepolia, where the priority fee frequently reads as ~0.
const FLOOR_PRIORITY_WEI = BigInt(
  process.env.NEXT_PUBLIC_MIN_PRIORITY_FEE_WEI || "100000000", // 0.1 gwei
);
const FLOOR_MAX_FEE_WEI = BigInt(
  process.env.NEXT_PUBLIC_MIN_MAX_FEE_WEI || "100000000", // 0.1 gwei
);

export interface Eip1559Fees {
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}

const maxBig = (a: bigint, b: bigint): bigint => (a > b ? a : b);

/**
 * Clamp the chain's fee estimate up to the configured floors, keeping the
 * invariant `maxFeePerGas >= maxPriorityFeePerGas` (a wallet rejects fees that
 * violate it). Pure and synchronous so the floor logic is unit-testable.
 */
export function clampFees(market: {
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}): Eip1559Fees {
  const maxPriorityFeePerGas = maxBig(
    market.maxPriorityFeePerGas ?? 0n,
    FLOOR_PRIORITY_WEI,
  );
  const maxFeePerGas = maxBig(
    maxBig(market.maxFeePerGas ?? 0n, FLOOR_MAX_FEE_WEI),
    maxPriorityFeePerGas,
  );
  return { maxFeePerGas, maxPriorityFeePerGas };
}
