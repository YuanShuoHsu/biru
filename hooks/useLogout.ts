import useSWRMutation from "swr/mutation";

import { useSnackbar } from "notistack";

import { useI18n } from "@/context/i18n";

import { useAuthStore } from "@/stores/useAuthStore";

import type { LogoutResponseDto } from "@/types/auth/logout-response.dto";

import { sendRequest } from "@/utils/fetcher";

export const useLogout = () => {
  const { clearAuth, setIsAuthLoading } = useAuthStore();

  const dict = useI18n();

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
      enqueueSnackbar(dict.member.auth.signOut.success, { variant: "success" });
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
