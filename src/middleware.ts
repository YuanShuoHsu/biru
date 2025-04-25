// https://nextjs.org/docs/app/building-your-application/routing/internationalization#routing-overview
// https://nextjs.org/docs/app/building-your-application/routing/middleware

import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { match } from "@formatjs/intl-localematcher";

const locales = ["zh-TW", "zh-CN", "en", "ja", "ko"];
const defaultLocale = "zh-TW";

const getLocale = (request: NextRequest) => {
  const headers = {
    "accept-language": request.headers.get("accept-language") || "",
  };

  const languages = new Negotiator({ headers }).languages();

  return match(languages, locales, defaultLocale);
};

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
