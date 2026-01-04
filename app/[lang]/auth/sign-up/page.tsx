import { notFound } from "next/navigation";

import AuthSignUp from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

const AuthSignUpPage = async ({
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

  return <AuthSignUp lang={lang} redirect={safeRedirect} />;
};

export default AuthSignUpPage;
