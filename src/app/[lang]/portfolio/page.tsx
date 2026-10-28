import type { Metadata } from "next";
import { Decor } from "@/components/Decor";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { getProjects } from "@/lib/projects";
import styles from "./portfolio.module.css";

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/[lang]/portfolio">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).portfolio;
  return { title: t.title, description: t.description };
}

export default async function PortfolioPage({ params }: PageProps<"/[lang]/portfolio">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).portfolio;
  const projects = await getProjects();

  return (
    <div className="container">
      <div className={styles.head}>
        <h1 className="page-title">{t.title}</h1>
        <Decor shape={4} className={styles.headDecor} />
      </div>
      <PortfolioGrid
        projects={projects}
        lang={lang}
        labels={{ all: t.all, filterLabel: t.filterLabel, countWord: t.countWord, empty: t.empty }}
      />
    </div>
  );
}
