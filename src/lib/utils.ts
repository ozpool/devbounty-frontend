import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and dedupe conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shorten a 0x address for display: 0x1234…abcd. */
export function shortAddress(address?: string | null, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

/** Format a decimal USDC string with thousands separators and trimmed zeros. */
export function formatUsdc(amount?: string | number | null): string {
  if (amount === null || amount === undefined || amount === "") return "0";
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(n)) return String(amount);
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/** Relative time like "3h ago" / "in 2d" from a date-ish value. */
export function timeAgo(value?: string | number | Date | null): string {
  if (!value) return "";
  const then = new Date(value).getTime();
  const diff = then - Date.now();
  const abs = Math.abs(diff);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86_400_000],
    ["hour", 3_600_000],
    ["minute", 60_000],
    ["second", 1000],
  ];
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, ms] of units) {
    if (abs >= ms || unit === "second") {
      return rtf.format(Math.round(diff / ms), unit);
    }
  }
  return "";
}

/**
 * Only allow same-origin relative redirect targets. Blocks protocol-relative
 * (`//evil.com`), backslash tricks (`/\evil.com`), and absolute URLs so a
 * crafted `?next=` can't bounce an authenticated user off-site.
 */
export function safeNextPath(next?: string | null, fallback = "/me"): string {
  if (!next || !next.startsWith("/")) return fallback;
  if (next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

/**
 * Allow only http(s) URLs as link targets. Backend-sourced fields (issueUrl,
 * prUrl) are attacker-influenced, so a `javascript:`/`data:` value rendered as
 * a raw href would run in-origin on click — fall back to `#` for anything else.
 */
export function safeHref(url?: string | null): string {
  return url && /^https?:\/\//i.test(url) ? url : "#";
}

/** Title-case a language/string for display. */
export function titleCase(s?: string | null): string {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
