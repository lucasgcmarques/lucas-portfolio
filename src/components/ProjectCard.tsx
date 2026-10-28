import Link from "next/link";
import { href, type Locale } from "@/lib/i18n";
import type { Project } from "@/lib/projects";
import { MediaFrame } from "./MediaFrame";
import { PixelLens } from "./PixelLens";
import styles from "./ProjectCard.module.css";

type Props = {
  project: Project;
  lang: Locale;
  /** "wide" ocupa a largura toda, em formato cinema. */
  size?: "default" | "wide";
  priority?: boolean;
  headingLevel?: "h2" | "h3";
};

export function ProjectCard({ project, lang, size = "default", priority = false, headingLevel = "h3" }: Props) {
  const Heading = headingLevel;

  return (
    <article className={`${styles.card} ${size === "wide" ? styles.wide : ""}`}>
      <Link href={href(lang, `/portfolio/${project.slug}`)} className={styles.link}>
        <PixelLens className={styles.frame}>
          {project.thumbnail ? (
            <MediaFrame media={project.thumbnail} alt="" className={styles.media} priority={priority} />
          ) : (
            <div className={styles.placeholder} aria-hidden="true" />
          )}
        </PixelLens>
        <div className={styles.caption}>
          <Heading className={styles.title}>{project.title}</Heading>
          <p className={styles.meta}>
            {project.year ? <span>{project.year}</span> : null}
            {project.category ? <span>{project.category}</span> : null}
          </p>
        </div>
      </Link>
    </article>
  );
}
