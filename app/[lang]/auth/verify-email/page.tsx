import { notFound } from "next/navigation";

import AuthVerifyEmail from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

const AuthVerifyEmailPage = async ({
  params,
  searchParams,
}: PageProps<"/[lang]">) => {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const { email, redirect } = await searchParams;

  const safeEmail = typeof email === "string" ? email : undefined;
  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return (
    <AuthVerifyEmail email={safeEmail} lang={lang} redirect={safeRedirect} />
  );
};

export default AuthVerifyEmailPage;
