"use client";

import { useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

import { query } from "@/constants/query";

import { useRouter } from "@/i18n/navigation";

import { CircularProgress, Stack, Typography } from "@mui/material";

import { useAuthStore } from "@/providers/auth-store-provider";

import type { UserResponseDto } from "@/types/users/user-response.dto";

import { fetchProfile } from "@/utils/auth";
import { getHref } from "@/utils/href";

const AuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken, setProfile, setIsAuthLoading, clearAuth } =
    useAuthStore((state) => state);
  const [hasHandledCallback, setHasHandledCallback] = useState(false);

  useEffect(() => {
    if (hasHandledCallback) return;

    const handleCallback = async () => {
      const accessToken =
        searchParams.get("token") || searchParams.get("access_token");
      const error = searchParams.get("error");
      const redirectTo = searchParams.get("redirectTo");

      if (error) {
        enqueueSnackbar(
          error === "access_denied"
            ? "Google login was cancelled"
            : "Google login failed. Please try again.",
          { variant: "error" },
        );
        const { href: signInRedirectHref } = getHref("/auth/sign-in", {
          [query.redirectTo]: redirectTo,
        });
        router.replace(signInRedirectHref);
        setHasHandledCallback(true);
        return;
      }

      if (!accessToken) {
        enqueueSnackbar("Authentication failed. Please try again.", {
          variant: "error",
        });
        const { href: signInRedirectHref } = getHref("/auth/sign-in", {
          [query.redirectTo]: redirectTo,
        });
        router.replace(signInRedirectHref);
        setHasHandledCallback(true);
        return;
      }

      setIsAuthLoading(true);

      try {
        setAccessToken(accessToken);
        const profile: UserResponseDto = await fetchProfile(accessToken);
        setProfile(profile);

        enqueueSnackbar("Successfully signed in with Google!", {
          variant: "success",
        });

        router.replace(redirectTo || "/");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        enqueueSnackbar("Failed to load user profile. Please try again.", {
          variant: "error",
        });
        clearAuth();
        const { href: signInRedirectHref } = getHref("/auth/sign-in", {
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
    setAccessToken,
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
