"use client";

import * as React from "react";
import { create } from "zustand";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";

interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  message?: string;
}

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

let counter = 0;

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (t) => {
    const id = ++counter;
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
    if (typeof window !== "undefined") {
      window.setTimeout(
        () => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
        4500,
      );
    }
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

/** Imperative toast API: `toast.success("Saved")`, `toast.error(...)`. */
export function useToast() {
  const push = useToastStore((s) => s.push);
  return React.useMemo(
    () => ({
      success: (title: string, message?: string) =>
        push({ tone: "success", title, message }),
      error: (title: string, message?: string) =>
        push({ tone: "error", title, message }),
      info: (title: string, message?: string) => push({ tone: "info", title, message }),
    }),
    [push],
  );
}

const ICON = { success: CheckCircle2, error: AlertCircle, info: Info } as const;
const TONE = {
  success: "text-success",
  error: "text-danger",
  info: "text-secondary",
} as const;

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICON[t.tone];
          return (
            <motion.div
              key={t.id}
              layout
              role={t.tone === "error" ? "alert" : "status"}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              className="glass pointer-events-auto flex items-start gap-3 rounded-xl border border-border p-3.5 shadow-xl"
            >
              <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", TONE[t.tone])} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{t.title}</p>
                {t.message && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.message}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
