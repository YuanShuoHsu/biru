import { notFound } from "next/navigation";

import AuthVerifyEmail from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

import { verifyEmailToken } from "@/utils/verifyEmail";

const AuthVerifyEmailPage = async ({
  params,
  searchParams,
}: PageProps<"/[lang]">) => {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const { email, id, redirect, token } = await searchParams;

  const safeEmail = typeof email === "string" ? email : "";
  const safeId = typeof id === "string" ? id : undefined;
  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;
  const safeToken = typeof token === "string" ? token : undefined;

  if ((!safeEmail || !safeId) && !safeToken) notFound();

  const errorMessage =
    safeId && safeToken ? await verifyEmailToken(safeId, safeToken, lang) : "";

  return (
    <AuthVerifyEmail
      email={safeEmail}
      errorMessage={errorMessage}
      lang={lang}
      redirect={safeRedirect}
      token={safeToken}
    />
  );
};

export default AuthVerifyEmailPage;
