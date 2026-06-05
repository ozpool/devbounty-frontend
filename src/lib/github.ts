// GitHub's public REST API exposes a repository's stable numeric id, which the
// backend requires when creating a bounty. Unauthenticated requests are rate
// limited (60/hour per IP) but need no token for public repositories.
const GITHUB_API = "https://api.github.com";

/**
 * Resolve a repository's numeric GitHub id from its "owner/repo" full name.
 * Returns the id on success, or null if the repo can't be found or read
 * (private, renamed, typo, or rate limited).
 */
export async function fetchRepoId(fullName: string): Promise<number | null> {
  const trimmed = fullName.trim();
  if (!/^[^/\s]+\/[^/\s]+$/.test(trimmed)) return null;

  try {
    const res = await fetch(`${GITHUB_API}/repos/${trimmed}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: number };
    return typeof data.id === "number" && data.id > 0 ? data.id : null;
  } catch {
    return null;
  }
}
