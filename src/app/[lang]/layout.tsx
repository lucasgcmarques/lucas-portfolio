import type { Metadata, Viewport } from "next";
import { Doto, Martian_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site, siteUrl } from "@/lib/site";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, href, locales } from "@/lib/i18n";
import "../globals.css";

const anybody = localFont({
  src: "../../fonts/Anybody-Variable.woff",
  variable: "--font-anybody",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "50% 150%" }],
});

// OLHO NEGRO do hero: versão variável da JRK feita para o site.
// Eixos: wght 100–900, wdth 70–600 e DESC 0–100 (descompensação).
const jrkOlhoNegro = localFont({
  src: "../../fonts/JRKOlhoNegro-VF.woff2",
  variable: "--font-jrk-olho-negro",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "70% 600%" }],
});

// Teste anterior para o hero. Não é variável: só tem um peso.
const courbe = localFont({
  src: "../../fonts/CourbeSans.otf",
  variable: "--font-courbe",
  display: "swap",
});

// Outra opção testada para o hero, também estática.
const jrk = localFont({
  src: "../../fonts/JRK.otf",
  variable: "--font-jrk",
  display: "swap",
});

// Texto corrido e interface: monoespaçada técnica, com eixo de largura.
const martian = Martian_Mono({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-martian",
  display: "swap",
});

// Títulos: pontos de matriz, como um painel de LED.
const doto = Doto({
  subsets: ["latin"],
  axes: ["ROND"],
  variable: "--font-doto",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: `${site.name} | ${site.person}`,
      template: `%s | ${site.name}`,
    },
    description: t.description,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [getDictionary(l).htmlLang, href(l, "/")])),
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${site.name} | ${site.person}`,
      description: t.description,
      locale: t.ogLocale,
    },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <html lang={t.htmlLang} className={`${anybody.variable} ${jrkOlhoNegro.variable} ${jrk.variable} ${courbe.variable} ${martian.variable} ${doto.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">
          {t.skipLink}
        </a>
        <SiteHeader
          lang={lang}
          labels={{ ...t.nav, home: t.homeLabel }}
          languages={locales.map((l) => ({ code: l, name: getDictionary(l).languageName }))}
        />
        <main id="conteudo">{children}</main>
        <SiteFooter lang={lang} />
      </body>
    </html>
  );
}
