import AuthSignUp from ".";

interface AuthSignUpPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const AuthSignUpPage = async ({
  params,
  searchParams,
}: AuthSignUpPageProps) => {
  const { lang } = await params;
  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return <AuthSignUp lang={lang} redirect={safeRedirect} />;
};

export default AuthSignUpPage;
