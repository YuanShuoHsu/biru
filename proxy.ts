// https://nextjs.org/docs/app/building-your-application/routing/internationalization
// https://nextjs.org/docs/app/api-reference/file-conventions/proxy

// https://next-intl.dev/docs/getting-started/app-router/without-i18n-routing

import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale, locales } from "./constants/locale";

import { match } from "@formatjs/intl-localematcher";

const getLocale = (request: NextRequest) => {
  const headers = {
    "accept-language": request.headers.get("accept-language") || "",
  };

  const languages = new Negotiator({ headers }).languages();

  return match(languages, locales, defaultLocale);
};

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const pathnameLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  const pathnameHasLocale = Boolean(pathnameLocale);

  const locale = getLocale(request);

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
    "/((?!api|_next/data|_next/static|_next/image|apple-icon.png|favicon.ico|icon\\.svg|icon-192x192\\.png|icon-512x512\\.png|manifest\\.webmanifest|opengraph-image\\.jpg|twitter-image\\.jpg|sitemap.xml|robots.txt|\\.well-known|images).*)",
  ],
};
