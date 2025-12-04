import MemberLegalPrivacy from "./index";

interface MemberLegalPrivacyPageProps {
  params: Promise<{ lang: string }>;
}

const MemberLegalPrivacyPage = async ({
  params,
}: MemberLegalPrivacyPageProps) => {
  const { lang } = await params;

  return <MemberLegalPrivacy lang={lang} />;
};

export default MemberLegalPrivacyPage;
