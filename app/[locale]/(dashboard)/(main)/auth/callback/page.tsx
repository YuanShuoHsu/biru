import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import AuthCallback from ".";

import type { Locale } from "@/i18n/routing";

import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

interface AuthCallbackPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function AuthCallbackPage({
  params,
}: AuthCallbackPageProps) {
  const { locale } = await params;

  setRequestLocale(locale);

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
      <AuthCallback />
    </Suspense>
  );
}
