import MemberAuthSignUp from ".";

interface MemberAuthSignUpPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MemberAuthSignUpPage = async ({
  params,
  searchParams,
}: MemberAuthSignUpPageProps) => {
  const { lang } = await params;
  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return <MemberAuthSignUp lang={lang} redirect={safeRedirect} />;
};

export default MemberAuthSignUpPage;
