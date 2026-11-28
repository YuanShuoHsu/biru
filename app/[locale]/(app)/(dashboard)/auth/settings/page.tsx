import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { SWRConfig, unstable_serialize } from "swr";

import Settings from ".";

import { routing } from "@/i18n/routing";

import { authClient } from "@/lib/auth-client";

import { listAccountsKey, listOrganizationsKey } from "@/utils/auth";
import { getSession } from "@/utils/session";

export const generateMetadata = async ({
  params,
}: PageProps<"/[locale]/auth/settings">): Promise<Metadata> => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const tAuth = await getTranslations({ locale, namespace: "auth" });

  return { title: tAuth("settings.label") };
};

const AuthSettingsPage = async () => {
  const reqHeaders = await headers();
  const [session, { data: accounts }, { data: organizations }] =
    await Promise.all([
      getSession(),
      authClient.listAccounts({ fetchOptions: { headers: reqHeaders } }),
      authClient.organization.list({ fetchOptions: { headers: reqHeaders } }),
    ]);

  const fallback = session
    ? {
        [unstable_serialize([listAccountsKey, session.user.id])]: accounts,
        [unstable_serialize([listOrganizationsKey, session.user.id])]:
          organizations,
      }
    : {};

  return (
    <SWRConfig value={{ fallback }}>
      <Settings />
    </SWRConfig>
  );
};

export default AuthSettingsPage;
