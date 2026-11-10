import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArtMosaic } from "@/components/ArtMosaic";
import { artWorks } from "@/lib/art";
import { getDictionary, hasLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/art">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).art;
  return { title: t.title, description: t.description };
}

export default async function ArtPage({ params }: PageProps<"/[lang]/art">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).art;

  return (
    <div className="container">
      <h1 className="page-title">{t.title}</h1>
      <ArtMosaic
        works={artWorks}
        labels={{ all: t.all, filterLabel: t.filterLabel, countWord: t.countWord, empty: t.empty }}
      />
    </div>
  );
}
