"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { Suspense, use, useEffect, useState } from "react";

import { useAuthStore } from "@/providers/auth-store-provider";

import { CircularProgress, Stack, Typography } from "@mui/material";

import type { UserResponseDto } from "@/types/users/user-response.dto";
import { fetchProfile } from "@/utils/auth";

function AuthCallbackContent({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken, setProfile, setIsAuthLoading, clearAuth } =
    useAuthStore((state) => state);
  const [hasHandledCallback, setHasHandledCallback] = useState(false);

  useEffect(() => {
    if (hasHandledCallback) return;

    const handleCallback = async () => {
      // Backend returns 'token', but we also check 'access_token' for compatibility
      const accessToken =
        searchParams.get("token") || searchParams.get("access_token");
      const error = searchParams.get("error");
      const redirect = searchParams.get("redirect");
      // Use lang from route params or search params
      const currentLang = lang || searchParams.get("lang") || "en";

      // Handle OAuth error
      if (error) {
        enqueueSnackbar(
          error === "access_denied"
            ? "Google login was cancelled"
            : "Google login failed. Please try again.",
          { variant: "error" },
        );
        router.replace(
          `/${currentLang}/auth/sign-in${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`,
        );
        setHasHandledCallback(true);
        return;
      }

      // Handle missing access token
      if (!accessToken) {
        enqueueSnackbar("Authentication failed. Please try again.", {
          variant: "error",
        });
        router.replace(
          `/${currentLang}/auth/sign-in${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`,
        );
        setHasHandledCallback(true);
        return;
      }

      setIsAuthLoading(true);

      try {
        // Store access token
        setAccessToken(accessToken);

        // Fetch user profile
        const profile: UserResponseDto = await fetchProfile(accessToken);
        setProfile(profile);

        enqueueSnackbar("Successfully signed in with Google!", {
          variant: "success",
        });

        // Redirect to intended page or home
        router.replace(redirect || `/${currentLang}`);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        enqueueSnackbar("Failed to load user profile. Please try again.", {
          variant: "error",
        });
        clearAuth();
        router.replace(
          `/${currentLang}/auth/sign-in${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`,
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
    lang,
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
}

export default function AuthCallbackPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  return (
    <Suspense
      fallback={
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <CircularProgress />
        </Stack>
      }
    >
      <AuthCallbackPageWrapper params={params} />
    </Suspense>
  );
}

function AuthCallbackPageWrapper({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  return <AuthCallbackContent params={{ lang }} />;
}
