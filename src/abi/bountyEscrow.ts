/**
 * BountyEscrow ABI (subset the frontend needs). Mirrors the deployed contract
 * surface in contracts/contracts/BountyEscrow.sol.
 *
 * The frontend only calls maintainer-signed methods: `create` and `refund`.
 * `release` is backend-signed and never invoked here. The `error` entries let
 * viem decode custom-error reverts into readable reasons (see escrow-errors.ts).
 */
export const bountyEscrowAbi = [
  { type: "error", name: "NotAuthorized", inputs: [] },
  { type: "error", name: "BountyExists", inputs: [] },
  { type: "error", name: "BountyNotOpen", inputs: [] },
  { type: "error", name: "ZeroAmount", inputs: [] },
  { type: "error", name: "AmountTooLarge", inputs: [] },
  { type: "error", name: "RefundTooEarly", inputs: [] },
  { type: "error", name: "NotMaintainer", inputs: [] },
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
