import { setRequestLocale } from "next-intl/server";

import AuthResetPassword from ".";

import type { Locale } from "@/i18n/routing";

interface AuthResetPasswordPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ redirectTo?: string }>;
}

const AuthResetPasswordPage = async ({
  params,
  searchParams,
}: AuthResetPasswordPageProps) => {
  const [{ locale }, { redirectTo }] = await Promise.all([
    params,
    searchParams,
  ]);

  setRequestLocale(locale);

  const safeRedirectTo =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : undefined;

  return <AuthResetPassword locale={locale} redirectTo={safeRedirectTo} />;
};

export default AuthResetPasswordPage;
