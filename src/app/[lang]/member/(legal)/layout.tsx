import MemberLegalClientLayout from "./MemberLegalClientLayout";

interface MemberLegalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

const MemberLegalLayout = async ({ children, params }: MemberLegalLayoutProps) => {
  const { lang } = await params;

  return <MemberLegalClientLayout lang={lang}>{children}</MemberLegalClientLayout>;
};

export default MemberLegalLayout;
