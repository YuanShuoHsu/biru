import { create } from "zustand";

import type { AuthResponseDto } from "@/types/auth/auth-response.dto";
import type { UserResponseDto } from "@/types/users/user-response.dto";

interface AuthState {
  accessToken: string | null;
  profile: UserResponseDto | null;
  setAccessToken: (accessToken: AuthResponseDto["access_token"]) => void;
  setProfile: (profile: UserResponseDto | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  profile: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  setProfile: (profile) => set({ profile }),
  clearAuth: () => set({ accessToken: null, profile: null }),
}));
