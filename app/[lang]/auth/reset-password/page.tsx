import { notFound } from "next/navigation";

import AuthResetPassword from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

const AuthResetPasswordPage = async ({
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

  return <AuthResetPassword lang={lang} redirectTo={safeRedirectTo} />;
};

export default AuthResetPasswordPage;
