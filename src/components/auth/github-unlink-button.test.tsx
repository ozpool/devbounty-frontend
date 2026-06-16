import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GithubUnlinkButton } from "./github-unlink-button";

const unlinkGithub = vi.fn();
vi.mock("@/lib/api", () => ({
  authApi: { unlinkGithub: () => unlinkGithub() },
}));

function renderButton() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <GithubUnlinkButton />
    </QueryClientProvider>,
  );
}

describe("GithubUnlinkButton", () => {
  beforeEach(() => unlinkGithub.mockReset());

  it("requires a confirm step before calling the API", async () => {
    unlinkGithub.mockResolvedValue({ unlinked: true });
    renderButton();

    // First click only reveals the confirm copy; it must not unlink yet.
    fireEvent.click(screen.getByRole("button", { name: /unlink/i }));
    expect(unlinkGithub).not.toHaveBeenCalled();
    expect(screen.getByText(/already claimed still pay out/i)).toBeInTheDocument();

    // Confirming actually calls the unlink endpoint.
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));
    await waitFor(() => expect(unlinkGithub).toHaveBeenCalledTimes(1));
  });

  it("cancel aborts without calling the API", () => {
    renderButton();
    fireEvent.click(screen.getByRole("button", { name: /unlink/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(unlinkGithub).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: /unlink/i })).toBeInTheDocument();
  });
});
