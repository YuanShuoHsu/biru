import MemberLegalTerms from "./index";

interface MemberLegalTermsPageProps {
  params: Promise<{ lang: string }>;
}

const MemberLegalTermsPage = async ({ params }: MemberLegalTermsPageProps) => {
  const { lang } = await params;

  return <MemberLegalTerms lang={lang} />;
};

export default MemberLegalTermsPage;
