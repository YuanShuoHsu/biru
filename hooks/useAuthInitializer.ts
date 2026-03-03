import { useEffect } from "react";

import { authClient } from "@/lib/auth-client";

import { useAuthStore } from "@/providers/auth-store-provider";

import type { UserResponseDto } from "@/types/users/user-response.dto";

export const useAuthInitializer = () => {
  const { clearAuth, setIsAuthLoading, setProfile } = useAuthStore(
    (state) => state,
  );

  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE === "true";

  useEffect(() => {
    if (isMaintenanceMode) return;

    const initAuthState = async () => {
      try {
        const { data } = await authClient.getSession();

        if (data?.user) {
          setProfile(data.user as unknown as UserResponseDto);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setIsAuthLoading(false);
      }
    };

    initAuthState();
  }, [clearAuth, isMaintenanceMode, setIsAuthLoading, setProfile]);
};
