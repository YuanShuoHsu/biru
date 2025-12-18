import BackButton from "../BackButton";
import MemberLegalPrivacy from "./index";

interface MemberLegalPrivacyPageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MemberLegalPrivacyPage = async ({
  params,
  searchParams,
}: MemberLegalPrivacyPageProps) => {
  const { lang } = await params;
  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return (
    <>
      <BackButton lang={lang} redirect={safeRedirect} />{" "}
      <MemberLegalPrivacy lang={lang} />;
    </>
  );
};

export default MemberLegalPrivacyPage;
