import Link from "next/link";
import { notFound } from "next/navigation";
import { Decor } from "@/components/Decor";
import { HeroWordmark } from "@/components/HeroWordmark";
import { ProjectCard } from "@/components/ProjectCard";
import { getDictionary, hasLocale, href } from "@/lib/i18n";
import { getProjects, pickFeatured, pickHeroMedia } from "@/lib/projects";
import { site } from "@/lib/site";
import { getAbout, getHeroVideo } from "@/lib/site-content";
import styles from "./home.module.css";

export const revalidate = 600;

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  const [projects, about, heroVideo] = await Promise.all([getProjects(), getAbout(lang), getHeroVideo()]);
  const featured = pickFeatured(projects);
  const [lead, ...rest] = featured;

  return (
    <>
      <div className={`container ${styles.first}`}>
        <HeroWordmark media={pickHeroMedia(projects, heroVideo)} role={t.role} />

        <div className={styles.intro}>
          <p className={styles.who}>
            {site.person}
            <span className={styles.role}>{t.city}</span>
          </p>
          <p className={styles.actions}>
            <Link href={href(lang, "/contato")} className={styles.talk}>
              {t.home.talk}
            </Link>
          </p>
        </div>
      </div>

      {lead ? (
        <section className={`container ${styles.featured}`} aria-labelledby="destaques">
          <h2 id="destaques" className="section-title">
            {t.home.featured}
          </h2>
          <ProjectCard project={lead} lang={lang} size="wide" priority />
          {rest.length > 0 ? (
            <div className={styles.featuredGrid}>
              {rest.map((project) => (
                <ProjectCard key={project.id} project={project} lang={lang} />
              ))}
            </div>
          ) : null}
          <p className={styles.more}>
            <Link href={href(lang, "/portfolio")}>{t.home.allProjects(projects.length)}</Link>
          </p>
        </section>
      ) : null}

      <section className={`container ${styles.credits}`} aria-labelledby="creditos">
        <Decor shape={1} className={styles.creditsDecor} />
        <h2 id="creditos" className="section-title">
          {t.home.credits}
        </h2>
        <p className={styles.creditList}>{about.credits.join(", ")}.</p>
      </section>
    </>
  );
}
