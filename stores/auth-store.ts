import { createStore } from "zustand/vanilla";

import type { UserResponseDto } from "@/types/users/user-response.dto";

type AuthState = {
  isAuthLoading: boolean;
  isSignedIn: boolean;
  profile: UserResponseDto | null;
};

type AuthActions = {
  clearAuth: () => void;
  setIsAuthLoading: (isAuthLoading: boolean) => void;
  setProfile: (profile: UserResponseDto | null) => void;
};

export type AuthStore = AuthState & AuthActions;

export const defaultInitState: AuthState = {
  isAuthLoading: true,
  isSignedIn: false,
  profile: null,
};

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  return createStore<AuthStore>()((set) => ({
    ...initState,
    clearAuth: () => {
      set(() => ({
        ...defaultInitState,
        isAuthLoading: false,
      }));
    },
    setIsAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
    setProfile: (profile) =>
      set(() => ({
        profile,
        isSignedIn: Boolean(profile),
      })),
  }));
};
