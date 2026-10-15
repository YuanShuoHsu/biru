import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import AuthAcceptInvitation from ".";

import type { Locale } from "@/i18n/routing";

interface AuthAcceptInvitationPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    email?: string;
    id?: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: AuthAcceptInvitationPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const tAuth = await getTranslations({ locale, namespace: "auth" });

  return { title: tAuth("acceptInvitation.label") };
};

const AuthAcceptInvitationPage = async ({
  searchParams,
}: AuthAcceptInvitationPageProps) => {
  const { email, id } = await searchParams;

  const safeEmail = typeof email === "string" ? email : "";
  const safeInvitationId = typeof id === "string" ? id : "";

  if (!safeEmail || !safeInvitationId) notFound();

  return (
    <AuthAcceptInvitation email={safeEmail} invitationId={safeInvitationId} />
  );
};

export default AuthAcceptInvitationPage;
