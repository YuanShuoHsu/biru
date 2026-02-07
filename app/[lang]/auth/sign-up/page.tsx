import { notFound } from "next/navigation";

import AuthSignUp from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

const AuthSignUpPage = async ({
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

  return <AuthSignUp lang={lang} redirectTo={safeRedirectTo} />;
};

export default AuthSignUpPage;
