import { Stack } from "@mui/material";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import DashboardHeader from ".";

import { routing } from "@/i18n/routing";

const DashboardLayout = async ({
  children,
  params,
}: LayoutProps<"/[locale]">) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <Stack padding={2} height="100%" gap={2}>
      <DashboardHeader />
      {children}
    </Stack>
  );
};

export default DashboardLayout;
