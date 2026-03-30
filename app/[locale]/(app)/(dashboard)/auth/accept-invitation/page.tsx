import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import AuthAcceptInvitation from ".";

import type { Locale } from "@/i18n/routing";

interface AuthAcceptInvitationPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    email?: string;
    token?: string;
  }>;
}

const AuthAcceptInvitationPage = async ({
  params,
  searchParams,
}: AuthAcceptInvitationPageProps) => {
  const { locale } = await params;

  setRequestLocale(locale);

  const { email, token } = await searchParams;

  const safeEmail = typeof email === "string" ? email : "";
  const safeToken = typeof token === "string" ? token : "";

  if (!safeToken || !safeEmail) notFound();

  return (
    <AuthAcceptInvitation email={safeEmail} locale={locale} token={safeToken} />
  );
};

export default AuthAcceptInvitationPage;
