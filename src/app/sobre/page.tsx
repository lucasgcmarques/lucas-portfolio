import type { Metadata } from "next";
import Link from "next/link";
import { NotionBlocks } from "@/components/notion/NotionBlocks";
import { notionConfigured } from "@/lib/notion/client";
import { getBlocks, getProjects, type Project } from "@/lib/projects";
import { site } from "@/lib/site";
import styles from "./about.module.css";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Sobre",
  description: `${site.person}, ${site.role} em ${site.city}: trajetória, ferramentas e formação.`,
};

function groupByYear(projects: Project[]): [number, Project[]][] {
  const years = new Map<number, Project[]>();
  for (const project of projects) {
    if (!project.year) continue;
    years.set(project.year, [...(years.get(project.year) ?? []), project]);
  }
  return [...years.entries()].sort((a, b) => b[0] - a[0]);
}

export default async function AboutPage() {
  const aboutPageId = process.env.NOTION_ABOUT_PAGE_ID;
  const [projects, aboutBlocks] = await Promise.all([
    getProjects(),
    aboutPageId && notionConfigured() ? getBlocks(aboutPageId) : Promise.resolve([]),
  ]);
  const timeline = groupByYear(projects);

  return (
    <div className="container">
      <h1 className="page-title">Sobre</h1>

      <div className={styles.layout}>
        <section className={styles.bio} aria-label="Biografia">
          {aboutBlocks.length > 0 ? (
            <NotionBlocks blocks={aboutBlocks} />
          ) : (
            site.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          )}
        </section>

        <aside className={styles.side}>
          <section aria-labelledby="ferramentas">
            <h2 id="ferramentas" className={styles.sideTitle}>
              Ferramentas
            </h2>
            <ul role="list" className={styles.tools}>
              {site.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="faco">
            <h2 id="faco" className={styles.sideTitle}>
              O que eu faço
            </h2>
            <ul role="list" className={styles.plain}>
              {site.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="formacao">
            <h2 id="formacao" className={styles.sideTitle}>
              Formação
            </h2>
            <ul role="list" className={styles.plain}>
              {site.education.map((item) => (
                <li key={item.title}>
                  {item.title}
                  <span className={styles.muted}>
                    {item.place}, {item.period}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {timeline.length > 0 ? (
        <section className={styles.timeline} aria-labelledby="trajetoria">
          <h2 id="trajetoria" className="section-title">
            Trajetória
          </h2>
          <ol role="list">
            {timeline.map(([year, items]) => (
              <li key={year} className={styles.year}>
                <p className={styles.yearLabel}>{year}</p>
                <ul role="list" className={styles.yearItems}>
                  {items.map((project) => (
                    <li key={project.id}>
                      <Link href={`/portfolio/${project.slug}`}>{project.title}</Link>
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
