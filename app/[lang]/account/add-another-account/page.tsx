import { notFound } from "next/navigation";

import AddAnotherAccount from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

const AccountAddAnotherAccountPage = async ({
  params,
  searchParams,
}: PageProps<"/[lang]">) => {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const { redirect } = await searchParams;

  const safeRedirect =
    typeof redirect === "string" && redirect.startsWith("/")
      ? redirect
      : undefined;

  return <AddAnotherAccount lang={lang} redirect={safeRedirect} />;
};

export default AccountAddAnotherAccountPage;
