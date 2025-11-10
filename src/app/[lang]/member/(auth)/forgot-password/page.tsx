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

  return <MemberAuthForgotPassword lang={lang} redirect={redirect} />;
};

export default MemberAuthForgotPasswordPage;
