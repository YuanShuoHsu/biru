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

  return <MemberAuthSignUp lang={lang} redirect={redirect} />;
};

export default MemberAuthSignUpPage;
