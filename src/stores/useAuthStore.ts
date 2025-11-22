import { create } from "zustand";

import type { AuthResponseDto } from "@/types/auth/auth-response.dto";
import type { UserResponseDto } from "@/types/users/user-response.dto";

interface AuthState {
  accessToken: string | null;
  isRefreshing: boolean;
  profile: UserResponseDto | null;
}

interface AuthActions {
  clearAuth: () => void;
  setAccessToken: (accessToken: AuthResponseDto["access_token"]) => void;
  setIsRefreshing: (isRefreshing: boolean) => void;
  setProfile: (profile: UserResponseDto | null) => void;
}

type AuthStore = AuthState & AuthActions;

const defaultAuthState: AuthState = {
  accessToken: null,
  isRefreshing: true,
  profile: null,
};

const createAuthStore = (initState: AuthState = defaultAuthState) =>
  create<AuthStore>()((set) => ({
    ...initState,
    clearAuth: () => set(() => ({ ...initState })),
    setAccessToken: (accessToken) => set({ accessToken }),
    setIsRefreshing: (isRefreshing) => set({ isRefreshing }),
    setProfile: (profile) => set({ profile }),
  }));

export const useAuthStore = createAuthStore();
