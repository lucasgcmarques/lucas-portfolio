import { NextResponse, type NextRequest } from "next/server";

/**
 * Português é o idioma padrão e fica sem prefixo: /sobre é reescrito por
 * dentro para /pt/sobre. /en e /fr passam direto. Quem digitar /pt/... é
 * redirecionado para a versão sem prefixo, para não haver URL duplicada.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (/^\/(en|fr)(\/|$)/.test(pathname)) return;

  if (/^\/pt(\/|$)/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/pt${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Fora: arquivos internos, API e qualquer arquivo com extensão (ícones,
  // vídeos, imagens, robots.txt, sitemap.xml).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
