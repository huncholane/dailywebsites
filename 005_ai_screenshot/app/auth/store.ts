import { create } from "zustand";
import { SessionUser } from "../auth/session";

export type SessionUserStore = {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
};

export const useSessionUserStore = create<SessionUserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
