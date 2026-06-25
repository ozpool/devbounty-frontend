"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RailItem {
  id: string;
  title: string;
}

/**
 * Sticky "on this page" rail with scroll-spy. An IntersectionObserver tracks
 * which section's heading is in the reading zone (just below the navbar) and
 * highlights it, the way docs sites do. A thin bar tracks overall progress so
 * you can see how far through the document you are.
 *
 * The rootMargin is the trick: `-88px 0px -70% 0px` shrinks the viewport's
 * observation band to a strip near the top, so a section counts as "current"
 * once its heading reaches that strip and stops counting once it scrolls past.
 */
export function WpTocRail({
  items,
  heading,
  meta,
}: {
  items: RailItem[];
  heading: string;
  meta: string;
}) {
  const [active, setActive] = React.useState(items[0]?.id ?? "");
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (inView[0]) setActive(inView[0].target.id);
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );
    for (const it of items) {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  React.useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, doc.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-24">
      <p className="font-display text-base font-semibold tracking-tight">{heading}</p>
      <p className="mt-1 font-mono text-xs text-muted-foreground">{meta}</p>

      <div className="mt-5 h-1 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-150"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        On this page
      </p>
      <ul className="mt-3 border-l border-border">
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors",
                  isActive
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {it.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
