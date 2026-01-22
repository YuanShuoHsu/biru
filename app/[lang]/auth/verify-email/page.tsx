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

  const { email, identifier, redirect, token } = await searchParams;

  const safeEmail = typeof email === "string" ? email : "";
  const safeIdentifier = typeof identifier === "string" ? identifier : "";
  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;
  const safeToken = typeof token === "string" ? token : "";

  if ((!safeEmail || !safeIdentifier) && !safeToken) notFound();

  const errorMessage =
    safeIdentifier && safeToken
      ? await verifyEmailToken(safeIdentifier, safeToken, lang)
      : "";

  return (
    <AuthVerifyEmail
      email={safeEmail}
      errorMessage={errorMessage}
      identifier={safeIdentifier}
      lang={lang}
      redirect={safeRedirect}
      token={safeToken}
    />
  );
};

export default AuthVerifyEmailPage;
