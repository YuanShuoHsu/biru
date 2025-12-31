import MemberAuthForgotPassword from ".";

interface MemberAuthForgotPasswordPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MemberAuthForgotPasswordPage = async ({
  params,
  searchParams,
}: MemberAuthForgotPasswordPageProps) => {
  const { lang } = await params;
  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return <MemberAuthForgotPassword lang={lang} redirect={safeRedirect} />;
};

export default MemberAuthForgotPasswordPage;
