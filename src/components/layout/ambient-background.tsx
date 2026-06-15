/** Fixed decorative backdrop: faint grid + drifting brand glows. Pure CSS. */
export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="bg-grid mask-fade-b absolute inset-0 opacity-40" />
      <div className="absolute inset-x-0 top-0 h-[42rem] bg-radial-fade" />
      <div className="absolute left-[8%] top-[18%] h-72 w-72 animate-glow-pulse rounded-full bg-primary/10 blur-[110px]" />
      <div className="absolute right-[6%] top-[38%] h-72 w-72 animate-glow-pulse rounded-full bg-secondary/10 blur-[110px] [animation-delay:2s]" />
    </div>
  );
}
