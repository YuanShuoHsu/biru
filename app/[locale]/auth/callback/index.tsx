"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/routing";

import { CircularProgress, Stack, Typography } from "@mui/material";

import { useAuthStore } from "@/providers/auth-store-provider";

import type { UserResponseDto } from "@/types/users/user-response.dto";

import { fetchProfile } from "@/utils/auth";

interface AuthCallbackProps {
  locale: Locale;
}

const AuthCallback = ({ locale }: AuthCallbackProps) => {
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
      const currentLang = locale || searchParams.get("locale") || "en";

      if (error) {
        enqueueSnackbar(
          error === "access_denied"
            ? "Google login was cancelled"
            : "Google login failed. Please try again.",
          { variant: "error" },
        );
        router.replace(
          `/${currentLang}/auth/sign-in${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
        );
        setHasHandledCallback(true);
        return;
      }

      if (!accessToken) {
        enqueueSnackbar("Authentication failed. Please try again.", {
          variant: "error",
        });
        router.replace(
          `/${currentLang}/auth/sign-in${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
        );
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

        router.replace(redirectTo || `/${currentLang}`);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        enqueueSnackbar("Failed to load user profile. Please try again.", {
          variant: "error",
        });
        clearAuth();
        router.replace(
          `/${currentLang}/auth/sign-in${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
        );
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
    locale,
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
