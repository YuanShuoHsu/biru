"use client";

import { useTranslations } from "next-intl";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

const OAuthSnackbar = () => {
  const tAuth = useTranslations("auth");

  useEffect(() => {
    const provider = sessionStorage.getItem("oauth_snackbar");
    if (!provider) return;

    sessionStorage.removeItem("oauth_snackbar");
    if (provider === "google")
      enqueueSnackbar(tAuth("google.success"), { variant: "success" });
  }, [tAuth]);

  return null;
};

export default OAuthSnackbar;
