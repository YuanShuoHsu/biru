import MemberLegalTerms from "./index";

interface MemberLegalTermsPageProps {
  params: Promise<{ lang: string }>;
}

const MemberAuthSignInPage = async ({ params }: MemberLegalTermsPageProps) => {
  const { lang } = await params;

  return <MemberLegalTerms lang={lang} />;
};

export default MemberAuthSignInPage;
