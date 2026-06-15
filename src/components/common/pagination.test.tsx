import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "./pagination";

describe("Pagination", () => {
  it("renders nothing when there is a single page", () => {
    const { container } = render(
      <Pagination page={1} pageSize={10} total={5} onPageChange={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the current range and page count", () => {
    render(<Pagination page={2} pageSize={10} total={35} onPageChange={() => {}} />);
    expect(screen.getByText("11–20 of 35")).toBeInTheDocument();
    expect(screen.getByText("2 / 4")).toBeInTheDocument();
  });

  it("advances on Next", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination page={1} pageSize={10} total={35} onPageChange={onPageChange} />,
    );
    fireEvent.click(screen.getByText("Next"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
