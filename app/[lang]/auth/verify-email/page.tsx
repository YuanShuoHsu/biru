import AuthVerifyEmail from ".";

interface AuthVerifyEmailPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const AuthVerifyEmailPage = async ({
  params,
  searchParams,
}: AuthVerifyEmailPageProps) => {
  const { lang } = await params;
  const { email, redirect } = await searchParams;

  const safeEmail = typeof email === "string" ? email : undefined;
  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return (
    <AuthVerifyEmail email={safeEmail} lang={lang} redirect={safeRedirect} />
  );
};

export default AuthVerifyEmailPage;
