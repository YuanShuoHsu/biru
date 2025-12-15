import { create } from "zustand";

import type { AuthResponseDto } from "@/types/auth/auth-response.dto";
import type { UserResponseDto } from "@/types/users/user-response.dto";

interface AuthState {
  accessToken: string | null;
  isAuthLoading: boolean;
  isSignedIn: boolean;
  profile: UserResponseDto | null;
}

interface AuthActions {
  clearAuth: () => void;
  setAccessToken: (accessToken: AuthResponseDto["access_token"]) => void;
  setIsAuthLoading: (isAuthLoading: boolean) => void;
  setProfile: (profile: UserResponseDto | null) => void;
}

type AuthStore = AuthState & AuthActions;

const defaultAuthState: AuthState = {
  accessToken: null,
  isAuthLoading: true,
  isSignedIn: false,
  profile: null,
};

const computeIsSignedIn = (
  accessToken: AuthState["accessToken"],
  profile: AuthState["profile"],
) => Boolean(accessToken && profile);

const createAuthStore = (initState: AuthState = defaultAuthState) =>
  create<AuthStore>()((set) => ({
    ...initState,
    clearAuth: () =>
      set(() => ({
        ...initState,
        isAuthLoading: false,
      })),
    setAccessToken: (accessToken) =>
      set((state) => ({
        accessToken,
        isSignedIn: computeIsSignedIn(accessToken, state.profile),
      })),
    setIsAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
    setProfile: (profile) =>
      set((state) => ({
        profile,
        isSignedIn: computeIsSignedIn(state.accessToken, profile),
      })),
  }));

export const useAuthStore = createAuthStore();
