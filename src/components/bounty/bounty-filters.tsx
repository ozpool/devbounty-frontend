"use client";

import { Search, X } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import type { BountyFilters as Filters, LifecycleStatus } from "@/lib/types";

const STATUSES: [string, string][] = [
  ["", "All statuses"],
  ["open", "Open"],
  ["claimed", "Claimed"],
  ["submitted", "PR submitted"],
  ["paid", "Paid"],
  ["refunded", "Refunded"],
];

const LANGS = ["", ...SUPPORTED_LANGUAGES];

export function BountyFilters({
  value,
  onChange,
}: {
  value: Filters;
  onChange: (patch: Partial<Filters>) => void;
}) {
  const active = Boolean(
    value.status || value.language || value.repo || value.minAmount,
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/40 p-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.repo ?? ""}
          onChange={(e) => onChange({ repo: e.target.value, page: 1 })}
          placeholder="Search repository (owner/name)"
          aria-label="Search by repository"
          className="pl-9"
        />
      </div>
      <Select
        value={value.status ?? ""}
        onChange={(e) =>
          onChange({ status: e.target.value as LifecycleStatus | "", page: 1 })
        }
        aria-label="Filter by status"
        className="lg:w-44"
      >
        {STATUSES.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </Select>
      <Select
        value={value.language ?? ""}
        onChange={(e) => onChange({ language: e.target.value, page: 1 })}
        aria-label="Filter by language"
        className="lg:w-40"
      >
        {LANGS.map((l) => (
          <option key={l} value={l}>
            {l || "All languages"}
          </option>
        ))}
      </Select>
      <Input
        type="number"
        min={0}
        inputMode="numeric"
        value={value.minAmount ?? ""}
        onChange={(e) => onChange({ minAmount: e.target.value, page: 1 })}
        placeholder="Min $"
        aria-label="Minimum reward in USDC"
        className="lg:w-28"
      />
      {active && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            onChange({
              status: "",
              language: "",
              repo: "",
              minAmount: "",
              page: 1,
            })
          }
          aria-label="Clear filters"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
