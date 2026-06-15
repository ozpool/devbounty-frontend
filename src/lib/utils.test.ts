import { describe, it, expect } from "vitest";
import {
  formatUsdc,
  safeHref,
  safeNextPath,
  shortAddress,
  timeAgo,
  titleCase,
} from "./utils";

describe("safeNextPath", () => {
  it("allows same-origin relative paths", () => {
    expect(safeNextPath("/bounties")).toBe("/bounties");
  });
  it("blocks protocol-relative, backslash and absolute targets", () => {
    expect(safeNextPath("//evil.com")).toBe("/me");
    expect(safeNextPath("/\\evil.com")).toBe("/me");
    expect(safeNextPath("https://evil.com")).toBe("/me");
  });
  it("uses the fallback for empty input", () => {
    expect(safeNextPath(null)).toBe("/me");
    expect(safeNextPath("", "/home")).toBe("/home");
  });
});

describe("formatUsdc", () => {
  it("adds thousands separators", () => {
    expect(formatUsdc("1000")).toBe("1,000");
    expect(formatUsdc("1234567")).toBe("1,234,567");
  });
  it("returns 0 for empty/nullish", () => {
    expect(formatUsdc("")).toBe("0");
    expect(formatUsdc(null)).toBe("0");
  });
});

describe("shortAddress", () => {
  it("truncates the middle", () => {
    expect(shortAddress("0x1234567890abcdef1234")).toBe("0x1234…1234");
  });
  it("returns empty for nullish", () => {
    expect(shortAddress()).toBe("");
  });
});

describe("timeAgo", () => {
  it("returns empty for nullish", () => {
    expect(timeAgo(null)).toBe("");
  });
});

describe("titleCase", () => {
  it("capitalizes the first letter", () => {
    expect(titleCase("rust")).toBe("Rust");
  });
});

describe("safeHref", () => {
  it("passes through http(s) urls", () => {
    expect(safeHref("https://github.com/o/r/issues/1")).toBe(
      "https://github.com/o/r/issues/1",
    );
    expect(safeHref("http://example.com")).toBe("http://example.com");
  });
  it("blocks javascript: and other schemes", () => {
    expect(safeHref("javascript:alert(1)")).toBe("#");
    expect(safeHref("data:text/html,<script>1</script>")).toBe("#");
    expect(safeHref("  javascript:alert(1)")).toBe("#");
  });
  it("falls back to # for nullish", () => {
    expect(safeHref(null)).toBe("#");
    expect(safeHref(undefined)).toBe("#");
  });
});
