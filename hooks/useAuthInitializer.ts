import { useEffect } from "react";

import { useAuthStore } from "@/providers/auth-store-provider";

import { AuthResponseDto } from "@/types/auth/auth-response.dto";

import { fetchProfile } from "@/utils/auth";
import { sendRequest } from "@/utils/fetcher";

export const useAuthInitializer = () => {
  const { clearAuth, setAccessToken, setIsAuthLoading, setProfile } =
    useAuthStore((state) => state);

  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE === "true";

  useEffect(() => {
    if (isMaintenanceMode) return;

    const initAuthState = async () => {
      const hasAuthCookie = document.cookie.includes("biru-auth=");

      if (!hasAuthCookie) {
        setIsAuthLoading(false);

        return;
      }

      setIsAuthLoading(true);

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
        setIsAuthLoading(false);
      }
    };

    initAuthState();
  }, [
    clearAuth,
    isMaintenanceMode,
    setAccessToken,
    setIsAuthLoading,
    setProfile,
  ]);
};
