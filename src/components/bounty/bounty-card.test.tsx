import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BountyCard } from "./bounty-card";
import type { Bounty } from "@/lib/types";

const bounty: Bounty = {
  bountyId: "0xabc",
  maintainerAddress: "0x1111111111111111111111111111111111111111",
  repo: { owner: "octo", name: "sdk", fullName: "octo/sdk", githubRepoId: 1 },
  issueNumber: 42,
  issueTitle: "Fix the race condition",
  issueUrl: "https://github.com/octo/sdk/issues/42",
  amountUsdc: "1500",
  language: "TypeScript",
  onChainStatus: "Open",
  lifecycleStatus: "open",
  refundWindowSnapshot: 1_209_600,
};

describe("BountyCard", () => {
  it("renders title, repo and formatted amount", () => {
    const { container } = render(<BountyCard bounty={bounty} />);
    expect(screen.getByText("Fix the race condition")).toBeInTheDocument();
    expect(screen.getByText(/octo\/sdk/)).toBeInTheDocument();
    expect(container.textContent).toContain("1,500");
  });

  it("links to the bounty detail page", () => {
    render(<BountyCard bounty={bounty} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/bounties/0xabc");
  });
});
