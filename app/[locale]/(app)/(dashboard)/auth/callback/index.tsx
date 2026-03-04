"use client";

import { useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef } from "react";

import { query } from "@/constants/query";

import { useRouter } from "@/i18n/navigation";

import { CircularProgress, Stack, Typography } from "@mui/material";

import { useAuthStore } from "@/providers/auth-store-provider";

import { getHref } from "@/utils/href";

const AuthCallback = () => {
  const session = useAuthStore((state) => state.session);

  const hasHandledCallback = useRef(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (hasHandledCallback.current) return;

    const error = searchParams.get("error");
    const redirectTo = searchParams.get("redirectTo");

    if (error) {
      enqueueSnackbar(
        error === "access_denied"
          ? "Google login was cancelled"
          : "Google login failed. Please try again.",
        { variant: "error" },
      );
      const signInRedirectHref = getHref("/auth/sign-in", {
        [query.redirectTo]: redirectTo,
      });
      router.replace(signInRedirectHref);
      hasHandledCallback.current = true;
      return;
    }

    if (session?.user) {
      enqueueSnackbar("Successfully signed in with Google!", {
        variant: "success",
      });
      router.replace(redirectTo || "/");
    } else {
      enqueueSnackbar("Authentication failed. Please try again.", {
        variant: "error",
      });
      const signInRedirectHref = getHref("/auth/sign-in", {
        [query.redirectTo]: redirectTo,
      });
      router.replace(signInRedirectHref);
    }

    hasHandledCallback.current = true;
  }, [session, searchParams, router]);

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ height: "100vh" }}
    >
      <CircularProgress />
      <Typography color="text.secondary" variant="body1">
        Completing Google sign-in...
      </Typography>
    </Stack>
  );
};

export default AuthCallback;
