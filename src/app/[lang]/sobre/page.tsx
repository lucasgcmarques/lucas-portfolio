import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Decor } from "@/components/Decor";
import { PixelLens } from "@/components/PixelLens";
import { NotionBlocks } from "@/components/notion/NotionBlocks";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, href } from "@/lib/i18n";
import { notionConfigured } from "@/lib/notion/client";
import { getBlocks, getProjects, type Project } from "@/lib/projects";
import { site } from "@/lib/site";
import styles from "./about.module.css";

export const revalidate = 600;

export async function generateMetadata({ params }: PageProps<"/[lang]/sobre">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).about;
  return { title: t.title, description: t.description };
}

function groupByYear(projects: Project[]): [number, Project[]][] {
  const years = new Map<number, Project[]>();
  for (const project of projects) {
    if (!project.year) continue;
    years.set(project.year, [...(years.get(project.year) ?? []), project]);
  }
  return [...years.entries()].sort((a, b) => b[0] - a[0]);
}

export default async function AboutPage({ params }: PageProps<"/[lang]/sobre">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).about;
  const aboutPageId = process.env.NOTION_ABOUT_PAGE_ID;
  const [projects, aboutBlocks] = await Promise.all([
    getProjects(),
    lang === "pt" && aboutPageId && notionConfigured() ? getBlocks(aboutPageId) : Promise.resolve([]),
  ]);
  const timeline = groupByYear(projects);

  return (
    <div className="container">
      {/* Topo: título e bio de um lado, a arte grande do outro. */}
      <div className={styles.top}>
        <div className={styles.text}>
          <h1 className="page-title">{t.title}</h1>
          <section className={styles.bio} aria-label={t.bioLabel}>
            {aboutBlocks.length > 0 ? (
              <NotionBlocks blocks={aboutBlocks} />
            ) : (
              t.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
            )}
          </section>
          <Decor shape={2} className={styles.bioDecor} />
        </div>

        <figure className={styles.art}>
          <PixelLens border={false} radius={240} pixel={14}>
            <Image
              src="/images/organismo.png"
              alt={t.artAlt}
              width={2070}
              height={2400}
              sizes="(max-width: 900px) 100vw, 55vw"
              priority
            />
          </PixelLens>
        </figure>
      </div>

      {timeline.length > 0 ? (
        <section className={styles.timeline} aria-labelledby="trajetoria">
          <h2 id="trajetoria" className="section-title">
            {t.timeline}
          </h2>
          <ol role="list">
            {timeline.map(([year, items]) => (
              <li key={year} className={styles.year}>
                <p className={styles.yearLabel}>{year}</p>
                <ul role="list" className={styles.yearItems}>
                  {items.map((project) => (
                    <li key={project.id}>
                      <Link href={href(lang, `/portfolio/${project.slug}`)}>{project.title}</Link>
                      {project.location ? <span className={styles.muted}>{project.location}</span> : null}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
