import { FlaskConical } from "lucide-react";

/** Fixed chip shown in demo mode so visitors know the data is seeded. */
export function DemoBadge() {
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[90]">
      <span className="glass inline-flex items-center gap-1.5 rounded-full border border-warning/40 px-3 py-1.5 text-xs font-medium text-warning shadow-lg">
        <FlaskConical className="h-3.5 w-3.5" />
        Demo data — no backend
      </span>
    </div>
  );
}
