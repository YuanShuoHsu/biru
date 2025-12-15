import useSWRMutation from "swr/mutation";

import { useAuthStore } from "@/stores/useAuthStore";

import type { LogoutResponseDto } from "@/types/auth/logout-response.dto";

import { sendRequest } from "@/utils/fetcher";

export const useLogout = () => {
  const { clearAuth, setIsAuthLoading } = useAuthStore();

  const { isMutating, trigger } = useSWRMutation<
    LogoutResponseDto,
    Error,
    string
  >(
    "/api/auth/logout",
    sendRequest({
      credentials: "include",
    }),
  );

  const handleLogout = async () => {
    setIsAuthLoading(true);

    try {
      await trigger();
    } finally {
      clearAuth();
    }
  };

  return {
    handleLogout,
    isMutatingLogout: isMutating,
    triggerLogout: trigger,
  };
};
