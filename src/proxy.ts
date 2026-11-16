import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, hasLocale, LOCALE_COOKIE } from "@/i18n/config";

/**
 * Locale routing (Next.js 16 "proxy", formerly middleware):
 *  • /en/... and /pt-br/... pass through and refresh the language cookie;
 *  • case variants (/PT-BR) are normalised;
 *  • anything else (e.g. "/") is redirected to the remembered language,
 *    or to English, the default.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first = "", ...rest] = pathname.split("/");
  const lower = first.toLowerCase();

  if (hasLocale(lower)) {
    if (first !== lower) {
      const url = request.nextUrl.clone();
      url.pathname = ["", lower, ...rest].join("/");
      return NextResponse.redirect(url, 308);
    }
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== lower) {
      response.cookies.set(LOCALE_COOKIE, lower, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return response;
  }

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = hasLocale(saved) ? saved : defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, static files and metadata routes.
  matcher: ["/((?!_next|api|images|favicon.svg|robots.txt|sitemap.xml|.*\\..*).*)"],
};
