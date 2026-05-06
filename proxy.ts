// https://github.com/vercel/next.js/tree/canary/examples/i18n-routing
// https://nextjs.org/docs/app/building-your-application/routing/internationalization
// https://nextjs.org/docs/app/api-reference/file-conventions/proxy

// https://next-intl.dev/docs/getting-started/app-router
// https://next-intl.dev/docs/routing/middleware

import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import { authClient } from "./lib/auth-client";

const handleI18nRouting = createMiddleware(routing);

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const pathnameLocale = routing.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  const locale = pathnameLocale || routing.defaultLocale;

  const response = handleI18nRouting(request);

  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE === "true";
  const isMaintenancePath =
    pathnameLocale && pathname === `/${pathnameLocale}/maintenance`;

  if (isMaintenanceMode) {
    if (isMaintenancePath) return response;

    return NextResponse.redirect(
      new URL(`/${locale}/maintenance`, request.url),
    );
  }

  if (isMaintenancePath)
    return NextResponse.redirect(new URL(`/${locale}`, request.url));

  const isAuthSettingsPage = pathname.startsWith(`/${locale}/auth/settings`);

  if (isAuthSettingsPage) {
    const { data: session } = await authClient.getSession({
      fetchOptions: { headers: request.headers },
    });

    if (!session) {
      const redirectTo =
        pathname.slice(`/${locale}`.length) + request.nextUrl.search;
      const url = new URL(`/${locale}/auth/sign-in`, request.url);
      if (redirectTo) url.searchParams.set("redirectTo", redirectTo);

      return NextResponse.redirect(url);
    }
  }

  return response;
};

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
