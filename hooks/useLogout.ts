import { useSnackbar } from "notistack";
import useSWRMutation from "swr/mutation";

import { useAuthStore } from "@/providers/auth-store-provider";
import { useI18nStore } from "@/providers/i18n-store-provider";

import type { LogoutResponseDto } from "@/types/auth/logout-response.dto";

import { sendRequest } from "@/utils/fetcher";

export const useLogout = () => {
  const { clearAuth, setIsAuthLoading } = useAuthStore((state) => state);

  const { dict } = useI18nStore((state) => state);

  const { enqueueSnackbar } = useSnackbar();

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
      enqueueSnackbar(dict.auth.signOut.success, { variant: "success" });
    } catch {
      return;
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
