import { cn } from "@/lib/utils";

/** Deterministic gradient avatar derived from an address — no external blockie dep. */
export function AddressAvatar({
  address,
  size = 28,
  className,
}: {
  address?: string;
  size?: number;
  className?: string;
}) {
  const a = (address || "0x0000").toLowerCase().replace(/^0x/, "");
  const seed = parseInt(a.slice(0, 6) || "0", 16) || 1;
  const h1 = seed % 360;
  const h2 = (seed * 13) % 360;
  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0 rounded-full ring-1 ring-border", className)}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(from 140deg, hsl(${h1} 85% 58%), hsl(${h2} 80% 48%), hsl(${h1} 85% 58%))`,
      }}
    />
  );
}
