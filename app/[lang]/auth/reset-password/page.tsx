import MemberAuthResetPassword from ".";

interface MemberAuthResetPasswordPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MemberAuthResetPasswordPage = async ({
  params,
  searchParams,
}: MemberAuthResetPasswordPageProps) => {
  const { lang } = await params;
  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return <MemberAuthResetPassword lang={lang} redirect={safeRedirect} />;
};

export default MemberAuthResetPasswordPage;
