import AuthResetPassword from ".";

interface AuthResetPasswordPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const AuthResetPasswordPage = async ({
  params,
  searchParams,
}: AuthResetPasswordPageProps) => {
  const { lang } = await params;
  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return <AuthResetPassword lang={lang} redirect={safeRedirect} />;
};

export default AuthResetPasswordPage;
