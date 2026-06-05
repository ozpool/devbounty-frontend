import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { LifecycleStatus } from "@/lib/types";

type Tone = NonNullable<BadgeProps["tone"]>;

const MAP: Record<LifecycleStatus, { label: string; tone: Tone }> = {
  pending_deposit: { label: "Pending deposit", tone: "warning" },
  open: { label: "Open", tone: "success" },
  claimed: { label: "Claimed", tone: "primary" },
  submitted: { label: "PR submitted", tone: "secondary" },
  releasing: { label: "Releasing", tone: "warning" },
  paid: { label: "Paid", tone: "neutral" },
  refunded: { label: "Refunded", tone: "neutral" },
  release_failed: { label: "Release failed", tone: "danger" },
};

export function StatusBadge({ status }: { status: LifecycleStatus }) {
  const s = MAP[status] ?? { label: status, tone: "neutral" as Tone };
  return (
    <Badge tone={s.tone}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {s.label}
    </Badge>
  );
}
