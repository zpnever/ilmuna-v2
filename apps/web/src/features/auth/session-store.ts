import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthSession } from "@/shared/api/contracts";

type SessionState = {
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  updateCurrentUser: (session: AuthSession["user"]) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      updateCurrentUser: (user) =>
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                user,
              }
            : null,
        })),
      clearSession: () => set({ session: null }),
    }),
    {
      name: "ilmuna-auth-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
      }),
    },
  ),
);

