import AuthSignIn from ".";

interface AuthSignInPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const AuthSignInPage = async ({
  params,
  searchParams,
}: AuthSignInPageProps) => {
  const { lang } = await params;
  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return <AuthSignIn lang={lang} redirect={safeRedirect} />;
};

export default AuthSignInPage;
