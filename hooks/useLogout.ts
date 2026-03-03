import { useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export const useLogout = () => {
  const [isMutatingLogout, setIsMutatingLogout] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const tAuth = useTranslations("auth");

  const handleLogout = async () => {
    setIsMutatingLogout(true);

    await authClient.signOut();

    enqueueSnackbar(tAuth("signOut.success"), { variant: "success" });
    setIsMutatingLogout(false);
  };

  return {
    handleLogout,
    isMutatingLogout,
  };
};
