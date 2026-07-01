import { env } from "@/lib/env";

/** Error carrying the HTTP status + parsed body so callers can branch on it. */
export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Query params appended to the path. */
  query?: Record<string, string | number | undefined | null>;
};

function buildUrl(path: string, query?: ApiOptions["query"]) {
  const url = new URL(path.replace(/^\//, ""), `${env.apiBaseUrl}/`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    }
  }
  return url.toString();
}

function toStringQuery(query?: ApiOptions["query"]) {
  const q: Record<string, string> = {};
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") q[k] = String(v);
    }
  }
  return q;
}

/** Serve seeded data in demo mode; the resolver chunk loads only when needed. */
async function demoFetch<T>(
  path: string,
  query: ApiOptions["query"],
  method: string | undefined,
  body: unknown,
): Promise<T> {
  const { resolveDemo, UNHANDLED, UNAUTHENTICATED } =
    await import("@/lib/demo/resolve");
  await new Promise((r) => setTimeout(r, 220)); // let loading states show
  const result = resolveDemo(
    method ?? (body !== undefined ? "POST" : "GET"),
    path,
    toStringQuery(query),
  );
  if (result === UNAUTHENTICATED) throw new ApiError(401, "Not signed in (demo)");
  if (result === UNHANDLED) throw new ApiError(404, "Not found (demo mode)");
  return result as T;
}

/**
 * Cookie-aware fetch. `credentials: "include"` sends the httpOnly JWT cookie
 * the backend set at SIWE verify. JSON in, JSON out, typed errors.
 */
export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { body, query, headers, ...rest } = options;

  if (env.demoMode) return demoFetch<T>(path, query, rest.method, body);

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      ...rest,
    });
  } catch {
    // fetch only rejects on a network-level failure (offline, DNS, CORS, server
    // unreachable), never on a 4xx/5xx. Surface that as connectivity, not a
    // generic "something went wrong".
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    // The backend sends { code, message, details }. Older code looked for an
    // `error` key, which never matched, so every failure showed a generic
    // "Request failed (N)". Read `message` first, fall back to `error`, then status.
    const obj =
      payload && typeof payload === "object"
        ? (payload as Record<string, unknown>)
        : null;
    const message =
      (obj && typeof obj.message === "string" && obj.message) ||
      (obj && typeof obj.error === "string" && obj.error) ||
      `Request failed (${res.status})`;
    throw new ApiError(res.status, message, payload);
  }

  return payload as T;
}
