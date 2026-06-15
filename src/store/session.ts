import { create } from "zustand";
import type { Me } from "@/lib/types";

export type SessionStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface SessionState {
  me: Me | null;
  status: SessionStatus;
  setMe: (me: Me | null) => void;
  setStatus: (status: SessionStatus) => void;
  reset: () => void;
}

/** Auth session mirror of the backend `/me`, hydrated by useSession. */
export const useSessionStore = create<SessionState>((set) => ({
  me: null,
  status: "idle",
  setMe: (me) => set({ me, status: me ? "authenticated" : "unauthenticated" }),
  setStatus: (status) => set({ status }),
  reset: () => set({ me: null, status: "unauthenticated" }),
}));
