"use client";

import { cn } from "@/lib/utils";

const OPTS: ["30d" | "all", string][] = [
  ["30d", "30 days"],
  ["all", "All time"],
];

export function WindowToggle({
  value,
  onChange,
}: {
  value: "30d" | "all";
  onChange: (v: "30d" | "all") => void;
}) {
  return (
    <div
      role="group"
      aria-label="Leaderboard time window"
      className="inline-flex rounded-lg border border-border bg-card/40 p-1"
    >
      {OPTS.map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            value === v
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
