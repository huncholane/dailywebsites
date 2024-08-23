import { create } from "zustand";
import { SessionUser } from "./session";

export type SessionUserStore = {
  user: SessionUser | null;
  setUser: (user: SessionUser | null) => void;
};

export const useSessionUserStore = create<SessionUserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
