import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders a human-readable label for a lifecycle status", () => {
    render(<StatusBadge status="pending_deposit" />);
    expect(screen.getByText("Pending deposit")).toBeInTheDocument();
  });

  it("maps the open status", () => {
    render(<StatusBadge status="open" />);
    expect(screen.getByText("Open")).toBeInTheDocument();
  });
});
