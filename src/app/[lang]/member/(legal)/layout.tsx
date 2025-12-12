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

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return (
    <MemberLegalClientLayout lang={lang} redirect={safeRedirect}>
      {children}
    </MemberLegalClientLayout>
  );
};

export default MemberLegalLayout;
