import { notFound } from "next/navigation";

import AuthForgotPassword from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

const AuthForgotPasswordPage = async ({
  params,
  searchParams,
}: PageProps<"/[lang]">) => {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const { redirectTo } = await searchParams;

  const safeRedirectTo =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : undefined;

  return <AuthForgotPassword lang={lang} redirectTo={safeRedirectTo} />;
};

export default AuthForgotPasswordPage;
