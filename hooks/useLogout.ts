import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import { useAuthStore } from "@/providers/auth-store-provider";

export const useLogout = () => {
  const { clearAuth } = useAuthStore((state) => state);
  const [isMutatingLogout, setIsMutatingLogout] = useState(false);

  const tAuth = useTranslations("auth");
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    setIsMutatingLogout(true);

    try {
      await authClient.signOut();
      enqueueSnackbar(tAuth("signOut.success"), { variant: "success" });
    } catch {
      return;
    } finally {
      clearAuth();
      setIsMutatingLogout(false);
    }
  };

  return {
    handleLogout,
    isMutatingLogout,
    triggerLogout: handleLogout,
  };
};
