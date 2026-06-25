import * as React from "react";
import { Reveal } from "@/components/motion";

/**
 * One numbered white-paper section. The `id` is the anchor the table of
 * contents links to; `scroll-mt-24` offsets the sticky navbar so a jumped-to
 * heading isn't hidden beneath it.
 */
export function WpSection({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section id={id} className="scroll-mt-24 border-t border-border/60 pt-12">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm text-primary">
            {String(number).padStart(2, "0")}
          </span>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h2>
        </div>
        <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
          {children}
        </div>
      </section>
    </Reveal>
  );
}
