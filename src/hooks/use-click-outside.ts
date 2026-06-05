"use client";

import * as React from "react";

/** Calls `handler` when a pointer/touch lands outside the referenced element. */
export function useClickOutside<T extends HTMLElement>(
  handler: () => void,
): React.RefObject<T> {
  const ref = React.useRef<T>(null);
  React.useEffect(() => {
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [handler]);
  return ref;
}
