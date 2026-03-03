"use client";

import { useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

import { query } from "@/constants/query";

import { useRouter } from "@/i18n/navigation";

import { authClient } from "@/lib/auth-client";

import { CircularProgress, Stack, Typography } from "@mui/material";

import { useAuthStore } from "@/providers/auth-store-provider";

import type { UserResponseDto } from "@/types/users/user-response.dto";

import { getHref } from "@/utils/href";

const AuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setProfile, setIsAuthLoading, clearAuth } = useAuthStore(
    (state) => state,
  );
  const [hasHandledCallback, setHasHandledCallback] = useState(false);

  useEffect(() => {
    if (hasHandledCallback) return;

    const handleCallback = async () => {
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
        setHasHandledCallback(true);
        return;
      }

      setIsAuthLoading(true);

      try {
        const { data } = await authClient.getSession();

        if (!data?.user) {
          enqueueSnackbar("Authentication failed. Please try again.", {
            variant: "error",
          });
          clearAuth();
          const signInRedirectHref = getHref("/auth/sign-in", {
            [query.redirectTo]: redirectTo,
          });
          router.replace(signInRedirectHref);
          return;
        }

        setProfile(data.user as unknown as UserResponseDto);
        enqueueSnackbar("Successfully signed in with Google!", {
          variant: "success",
        });

        router.replace(redirectTo || "/");
      } catch (err) {
        console.error("Failed to get session:", err);
        enqueueSnackbar("Failed to load user profile. Please try again.", {
          variant: "error",
        });
        clearAuth();
        const signInRedirectHref = getHref("/auth/sign-in", {
          [query.redirectTo]: redirectTo,
        });
        router.replace(signInRedirectHref);
      } finally {
        setIsAuthLoading(false);
        setHasHandledCallback(true);
      }
    };

    handleCallback();
  }, [
    hasHandledCallback,
    searchParams,
    router,
    setProfile,
    setIsAuthLoading,
    clearAuth,
  ]);

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
