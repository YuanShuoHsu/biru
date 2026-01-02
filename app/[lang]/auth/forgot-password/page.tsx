import AuthForgotPassword from ".";

interface AuthForgotPasswordPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const AuthForgotPasswordPage = async ({
  params,
  searchParams,
}: AuthForgotPasswordPageProps) => {
  const { lang } = await params;
  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return <AuthForgotPassword lang={lang} redirect={safeRedirect} />;
};

export default AuthForgotPasswordPage;
