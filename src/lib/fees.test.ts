import { describe, it, expect } from "vitest";
import { clampFees } from "./fees";

const FLOOR = 100_000_000n; // 0.1 gwei default

describe("clampFees", () => {
  it("raises a sub-floor market estimate up to the floor", () => {
    const f = clampFees({ maxFeePerGas: 1n, maxPriorityFeePerGas: 1n });
    expect(f.maxPriorityFeePerGas).toBe(FLOOR);
    expect(f.maxFeePerGas).toBe(FLOOR);
  });

  it("keeps a market estimate that already exceeds the floor", () => {
    const high = 5_000_000_000n; // 5 gwei
    const f = clampFees({ maxFeePerGas: high, maxPriorityFeePerGas: high });
    expect(f.maxFeePerGas).toBe(high);
    expect(f.maxPriorityFeePerGas).toBe(high);
  });

  it("never lets maxFeePerGas fall below maxPriorityFeePerGas", () => {
    const f = clampFees({ maxFeePerGas: 1n, maxPriorityFeePerGas: 5_000_000_000n });
    expect(f.maxFeePerGas).toBe(5_000_000_000n);
  });

  it("treats missing fields as zero and falls back to the floor", () => {
    const f = clampFees({});
    expect(f.maxFeePerGas).toBe(FLOOR);
    expect(f.maxPriorityFeePerGas).toBe(FLOOR);
  });
});
