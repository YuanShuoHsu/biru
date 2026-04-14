import { useLocale, useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useState } from "react";

import { authClient, getErrorMessage } from "@/lib/auth-client";

import { useAuthStore } from "@/providers/auth-store-provider";

interface UseLogoutProps {
  onSuccess?: () => void;
}

export const useLogout = ({ onSuccess }: UseLogoutProps = {}) => {
  const [isMutatingLogout, setIsMutatingLogout] = useState(false);

  const { setSession } = useAuthStore((state) => state);

  const locale = useLocale();

  const { enqueueSnackbar } = useSnackbar();

  const tAuth = useTranslations("auth");

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onError: ({ error: { code } }) => {
          setIsMutatingLogout(false);

          enqueueSnackbar(getErrorMessage(code, locale), {
            variant: "error",
          });
        },
        onRequest: () => setIsMutatingLogout(true),
        onSuccess: () => {
          setSession(null);

          setIsMutatingLogout(false);

          enqueueSnackbar(tAuth("signOut.success"), { variant: "success" });

          onSuccess?.();
        },
      },
    });
  };

  return {
    handleLogout,
    isMutatingLogout,
  };
};
