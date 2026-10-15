import { NextIntlClientProvider } from "next-intl";

import AppClientProviders from "./AppClientProviders";

import { getSession } from "@/utils/session";

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  const fallback = {};

  return (
    <NextIntlClientProvider>
      <AppClientProviders fallback={fallback} sessionPromise={getSession()}>
        {children}
      </AppClientProviders>
    </NextIntlClientProvider>
  );
};

export default AppProviders;
