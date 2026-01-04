import { notFound } from "next/navigation";

import AuthResetPassword from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

const AuthResetPasswordPage = async ({
  params,
  searchParams,
}: PageProps<"/[lang]">) => {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return <AuthResetPassword lang={lang} redirect={safeRedirect} />;
};

export default AuthResetPasswordPage;
