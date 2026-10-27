import Link from "next/link";
import { HeroWordmark } from "@/components/HeroWordmark";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects, pickFeatured, pickHeroMedia } from "@/lib/projects";
import { site } from "@/lib/site";
import styles from "./home.module.css";

export const revalidate = 600;

export default async function HomePage() {
  const projects = await getProjects();
  const featured = pickFeatured(projects);
  const [lead, ...rest] = featured;

  return (
    <>
      <div className="container">
        <HeroWordmark media={pickHeroMedia(projects)} />

        <div className={styles.intro}>
          <p className={styles.who}>
            {site.person}
            <span className={styles.role}>
              {site.role}, {site.city}
            </span>
          </p>
          <p className={styles.statement}>{site.intro}</p>
          <p className={styles.actions}>
            <Link href="/portfolio">Ver o portfólio</Link>
            <Link href="/contato">Pedir um orçamento</Link>
          </p>
        </div>
      </div>

      {lead ? (
        <section className={`container ${styles.featured}`} aria-labelledby="destaques">
          <h2 id="destaques" className="section-title">
            Trabalhos em destaque
          </h2>
          <ProjectCard project={lead} size="wide" priority />
          {rest.length > 0 ? (
            <div className={styles.featuredGrid}>
              {rest.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : null}
          <p className={styles.more}>
            <Link href="/portfolio">Todos os {projects.length} projetos</Link>
          </p>
        </section>
      ) : null}

      <section className={`container ${styles.credits}`} aria-labelledby="creditos">
        <h2 id="creditos" className="section-title">
          Palcos e artistas
        </h2>
        <p className={styles.creditList}>{site.credits.join(", ")}.</p>
      </section>
    </>
  );
}
