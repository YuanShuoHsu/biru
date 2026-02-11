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

  const { email, identifier, redirectTo, token } = await searchParams;

  const safeEmail = typeof email === "string" ? email : "";
  const safeIdentifier = typeof identifier === "string" ? identifier : "";
  const safeRedirectTo =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : undefined;
  const safeToken = typeof token === "string" ? token : "";

  if (!safeEmail || (!safeIdentifier && !safeToken)) notFound();

  const errorMessage = safeToken ? await verifyEmailToken(lang, safeToken) : "";

  return (
    <AuthVerifyEmail
      email={safeEmail}
      errorMessage={errorMessage}
      identifier={safeIdentifier}
      lang={lang}
      redirectTo={safeRedirectTo}
      token={safeToken}
    />
  );
};

export default AuthVerifyEmailPage;
