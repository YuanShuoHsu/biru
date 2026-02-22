import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import useSWRMutation from "swr/mutation";

import { useAuthStore } from "@/providers/auth-store-provider";

import type { LogoutResponseDto } from "@/types/auth/logout-response.dto";

import { sendRequest } from "@/utils/fetcher";

export const useLogout = () => {
  const { clearAuth, setIsAuthLoading } = useAuthStore((state) => state);

  const tAuth = useTranslations("auth");

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
      enqueueSnackbar(tAuth("signOut.success"), { variant: "success" });
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
