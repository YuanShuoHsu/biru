import { notFound } from "next/navigation";

import AddAnotherAccount from ".";

import { hasLocale } from "@/app/[lang]/dictionaries";

const AccountAddAnotherAccountPage = async ({
  params,
  searchParams,
}: PageProps<"/[lang]">) => {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const { redirectTo } = await searchParams;

  const safeRedirectTo =
    typeof redirectTo === "string" && redirectTo.startsWith("/")
      ? redirectTo
      : undefined;

  return <AddAnotherAccount lang={lang} redirectTo={safeRedirectTo} />;
};

export default AccountAddAnotherAccountPage;
