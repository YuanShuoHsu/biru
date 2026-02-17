// https://github.com/vercel/next.js/tree/canary/examples/i18n-routing
// https://nextjs.org/docs/app/building-your-application/routing/internationalization
// https://nextjs.org/docs/app/api-reference/file-conventions/proxy

// https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing

import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { i18n } from "./i18n-config";

import { match } from "@formatjs/intl-localematcher";

const getLocale = (request: NextRequest): string | undefined => {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales = Array.from(i18n.locales);

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = match(languages, locales, i18n.defaultLocale);

  return locale;
};

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const pathnameLocale = i18n.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  const pathnameHasLocale = Boolean(pathnameLocale);

  const locale = getLocale(request);

  const hasAuthHint = request.cookies.get("biru-auth")?.value === "true";

  const isAuthPage = pathname.includes("/auth");
  const isAccountPage = pathname.includes("/account");

  if (hasAuthHint && isAuthPage)
    return NextResponse.redirect(
      new URL(`/${locale}/account/my-account`, request.url),
    );

  if (!hasAuthHint && isAccountPage)
    return NextResponse.redirect(
      new URL(`/${locale}/auth/sign-in`, request.url),
    );

  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE === "true";
  const isMaintenancePath =
    pathnameLocale && pathname === `/${pathnameLocale}/maintenance`;
  if (isMaintenanceMode) {
    if (isMaintenancePath) return;

    request.nextUrl.pathname = `/${pathnameLocale || locale}/maintenance`;
    return NextResponse.redirect(request.nextUrl);
  }
  if (isMaintenancePath) {
    request.nextUrl.pathname = `/${pathnameLocale}`;
    return NextResponse.redirect(request.nextUrl);
  }

  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
};

export const config = {
  matcher: [
    "/((?!api|_next/data|_next/static|_next/image|apple-icon.png|favicon.ico|icon\\.svg|icon-192x192\\.png|icon-512x512\\.png|manifest\\.webmanifest|opengraph-image\\.jpg|twitter-image\\.jpg|[^/]+/opengraph-image\\.jpg|[^/]+/twitter-image\\.jpg|sitemap.xml|robots.txt|\\.well-known|images).*)",
  ],
};
