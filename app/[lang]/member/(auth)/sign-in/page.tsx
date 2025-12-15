import MemberAuthSignIn from ".";

interface MemberAuthSignInPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MemberAuthSignInPage = async ({
  params,
  searchParams,
}: MemberAuthSignInPageProps) => {
  const { lang } = await params;
  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return <MemberAuthSignIn lang={lang} redirect={safeRedirect} />;
};

export default MemberAuthSignInPage;
