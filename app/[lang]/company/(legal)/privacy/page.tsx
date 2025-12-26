import MemberLegalPrivacy from "./index";

import BackButton from "@/components/BackButton";

interface MemberLegalPrivacyPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MemberLegalPrivacyPage = async ({
  params,
  searchParams,
}: MemberLegalPrivacyPageProps) => {
  const { lang } = await params;
  const { back, redirect } = await searchParams;

  const safeBack =
    typeof back === "string" && back.startsWith("/") ? back : undefined;
  const safeRedirect = typeof redirect === "string" ? redirect : undefined;

  return (
    <>
      <BackButton back={safeBack} lang={lang} redirect={safeRedirect} />
      <MemberLegalPrivacy lang={lang} />
    </>
  );
};

export default MemberLegalPrivacyPage;
