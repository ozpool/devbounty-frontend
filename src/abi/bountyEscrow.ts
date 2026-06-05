/**
 * BountyEscrow ABI (subset the frontend needs). Mirrors the contract surface in
 * ARCHITECTURE.md §8. Replace with the synced artifact ABI once the contract is
 * deployed (see scripts/sync-abi per the spec).
 *
 * The frontend only calls maintainer-signed methods: `create` and `refund`.
 * `release` is backend-signed and never invoked here.
 */
export const bountyEscrowAbi = [
  {
    type: "function",
    name: "create",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "bytes32" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "refund",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "bytes32" }],
    outputs: [],
  },
  {
    type: "function",
    name: "bounties",
    stateMutability: "view",
    inputs: [{ name: "", type: "bytes32" }],
    outputs: [
      { name: "maintainer", type: "address" },
      { name: "amount", type: "uint96" },
      { name: "createdAt", type: "uint64" },
      { name: "refundWindow", type: "uint64" },
      { name: "status", type: "uint8" },
    ],
  },
  {
    type: "function",
    name: "defaultRefundWindow",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint64" }],
  },
  {
    type: "event",
    name: "BountyCreated",
    inputs: [
      { name: "id", type: "bytes32", indexed: true },
      { name: "maintainer", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
      { name: "refundWindow", type: "uint64", indexed: false },
    ],
  },
  {
    type: "event",
    name: "BountyRefunded",
    inputs: [
      { name: "id", type: "bytes32", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
] as const;
