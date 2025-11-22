"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/stores/useAuthStore";

import { AuthResponseDto } from "@/types/auth/auth-response.dto";

import { fetchProfile } from "@/utils/auth";
import { sendRequest } from "@/utils/fetcher";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const { clearAuth, setAccessToken, setIsRefreshing, setProfile } =
    useAuthStore();

  useEffect(() => {
    const initAuthState = async () => {
      setIsRefreshing(true);

      try {
        const { access_token } = await sendRequest<AuthResponseDto>({
          credentials: "include",
        })("/api/auth/refresh");
        setAccessToken(access_token);

        const profile = await fetchProfile(access_token);
        setProfile(profile);
      } catch {
        clearAuth();
      } finally {
        setIsRefreshing(false);
      }
    };

    initAuthState();
  }, [clearAuth, setAccessToken, setIsRefreshing, setProfile]);

  return <>{children}</>;
};

export default AuthProvider;
