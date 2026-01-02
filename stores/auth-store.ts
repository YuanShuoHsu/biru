import { createStore } from "zustand/vanilla";

import type { AuthResponseDto } from "@/types/auth/auth-response.dto";
import type { UserResponseDto } from "@/types/users/user-response.dto";

type AuthState = {
  accessToken: string | null;
  isAuthLoading: boolean;
  isSignedIn: boolean;
  profile: UserResponseDto | null;
};

type AuthActions = {
  clearAuth: () => void;
  setAccessToken: (accessToken: AuthResponseDto["access_token"]) => void;
  setIsAuthLoading: (isAuthLoading: boolean) => void;
  setProfile: (profile: UserResponseDto | null) => void;
};

export type AuthStore = AuthState & AuthActions;

export const defaultInitState: AuthState = {
  accessToken: null,
  isAuthLoading: true,
  isSignedIn: false,
  profile: null,
};

const computeIsSignedIn = (
  accessToken: AuthState["accessToken"],
  profile: AuthState["profile"],
) => Boolean(accessToken && profile);

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  return createStore<AuthStore>()((set) => ({
    ...initState,
    clearAuth: () => {
      if (typeof window !== "undefined") {
        document.cookie =
          "biru-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      set(() => ({
        ...defaultInitState,
        isAuthLoading: false,
      }));
    },
    setAccessToken: (accessToken) => {
      if (typeof window !== "undefined" && accessToken) {
        document.cookie =
          "biru-auth=true; path=/; max-age=2592000; SameSite=Lax";
      }
      set((state) => ({
        accessToken,
        isSignedIn: computeIsSignedIn(accessToken, state.profile),
      }));
    },
    setIsAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
    setProfile: (profile) =>
      set((state) => ({
        profile,
        isSignedIn: computeIsSignedIn(state.accessToken, profile),
      })),
  }));
};
