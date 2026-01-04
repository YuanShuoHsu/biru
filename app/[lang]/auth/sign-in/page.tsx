import { notFound } from "next/navigation";

import AuthSignIn from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

const AuthSignInPage = async ({
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

  return <AuthSignIn lang={lang} redirect={safeRedirect} />;
};

export default AuthSignInPage;
