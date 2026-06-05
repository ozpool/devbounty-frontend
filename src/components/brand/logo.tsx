import { cn } from "@/lib/utils";

/** DevBounty mark: a crosshair locked on a target = "aim a bounty at a bug". */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
        <defs>
          <linearGradient id="db-mark" x1="0" y1="0" x2="32" y2="32">
            <stop stopColor="hsl(158 46% 52%)" />
            <stop offset="1" stopColor="hsl(250 40% 70%)" />
          </linearGradient>
        </defs>
        <rect
          x="2"
          y="2"
          width="28"
          height="28"
          rx="9"
          fill="url(#db-mark)"
          fillOpacity="0.14"
          stroke="url(#db-mark)"
          strokeWidth="1.4"
        />
        <circle cx="16" cy="16" r="5.5" stroke="url(#db-mark)" strokeWidth="2" />
        <path
          d="M16 5v5M16 22v5M5 16h5M22 16h5"
          stroke="url(#db-mark)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {showWordmark && (
        <span className="font-display text-lg font-bold tracking-tight">
          Dev<span className="text-primary">Bounty</span>
        </span>
      )}
    </span>
  );
}
