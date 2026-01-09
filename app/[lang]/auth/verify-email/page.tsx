import { notFound } from "next/navigation";

import AuthVerifyEmail from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

import { getErrorMessage } from "@/utils/errors";
import { sendRequest } from "@/utils/fetcher";

const AuthVerifyEmailPage = async ({
  params,
  searchParams,
}: PageProps<"/[lang]">) => {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const { email, redirect: redirectUrl, token } = await searchParams;

  const safeEmail = typeof email === "string" ? email : undefined;
  const safeRedirect =
    typeof redirectUrl === "string" && redirectUrl.startsWith("/")
      ? redirectUrl
      : undefined;
  const safeToken = typeof token === "string" ? token : undefined;

  if (!safeEmail && !safeToken) notFound();

  let errorMessage: string | undefined;

  if (safeToken)
    try {
      await sendRequest<unknown, { token: string }>()(
        "/api/mail/verify-email",
        {
          arg: { token: safeToken },
        },
      );
    } catch (error) {
      errorMessage = getErrorMessage(error);
    }

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
