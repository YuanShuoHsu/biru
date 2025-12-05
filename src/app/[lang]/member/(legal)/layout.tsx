import MemberLegalClientLayout from "./MemberLegalClientLayout";

interface MemberLegalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const MemberLegalLayout = async ({
  children,
  params,
  searchParams,
}: MemberLegalLayoutProps) => {
  const { lang } = await params;
  const { redirect } = await searchParams;

  return (
    <MemberLegalClientLayout lang={lang} redirect={redirect}>
      {children}
    </MemberLegalClientLayout>
  );
};

export default MemberLegalLayout;
