import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import AuthResetPassword from ".";

import type { Locale } from "@/i18n/routing";

interface AuthResetPasswordPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    error?: string;
    redirectTo?: string;
    token?: string;
  }>;
}

const AuthResetPasswordPage = async ({
  params,
  searchParams,
}: AuthResetPasswordPageProps) => {
  const [{ locale }, { error, redirectTo, token }] = await Promise.all([
    params,
    searchParams,
  ]);

  setRequestLocale(locale);

  const safeToken = typeof token === "string" ? token : "";
  const safeRedirectTo =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : undefined;

  if (error || !safeToken) notFound();

  return <AuthResetPassword redirectTo={safeRedirectTo} token={safeToken} />;
};

export default AuthResetPasswordPage;
