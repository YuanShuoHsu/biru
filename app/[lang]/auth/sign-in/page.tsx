import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import AuthSignIn from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

import { REMEMBER_ME } from "@/constants/sign-in";

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

  const cookieStore = await cookies();
  const rememberMe = cookieStore.get(REMEMBER_ME)?.value === "true";

  return (
    <AuthSignIn rememberMe={rememberMe} lang={lang} redirect={safeRedirect} />
  );
};

export default AuthSignInPage;
