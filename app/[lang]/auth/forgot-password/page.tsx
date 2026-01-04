import { notFound } from "next/navigation";

import AuthForgotPassword from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

const AuthForgotPasswordPage = async ({
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

  return <AuthForgotPassword lang={lang} redirect={safeRedirect} />;
};

export default AuthForgotPasswordPage;
