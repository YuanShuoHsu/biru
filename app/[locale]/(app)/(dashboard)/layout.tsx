import { Stack } from "@mui/material";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import DashboardActions from "@/components/DashboardActions";
import RouterBreadcrumbs from "@/components/RouterBreadcrumbs";

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
      <Stack
        flexWrap={{ xs: "wrap", sm: "nowrap" }}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <RouterBreadcrumbs />
        {/* TODO: move dashboard actions */}
        <DashboardActions />
      </Stack>
      {children}
    </Stack>
  );
};

export default DashboardLayout;
