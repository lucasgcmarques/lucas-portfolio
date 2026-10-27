import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaFrame } from "@/components/MediaFrame";
import { NotionBlocks } from "@/components/notion/NotionBlocks";
import { VideoEmbed } from "@/components/notion/VideoEmbed";
import { formatDateRange } from "@/lib/format";
import { parseVideo } from "@/lib/media";
import { getBlocks, getProjectBySlug, getProjects } from "@/lib/projects";
import styles from "./project.module.css";

export const revalidate = 600;
/** Projetos novos no Notion ganham página sem precisar de um novo deploy. */
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projeto não encontrado" };

  const image = project.thumbnail?.kind === "image" ? project.thumbnail.src : undefined;
  return {
    title: project.title,
    description: project.description || undefined,
    openGraph: {
      title: project.title,
      description: project.description || undefined,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [blocks, projects] = await Promise.all([getBlocks(project.id), getProjects()]);
  const index = projects.findIndex((p) => p.id === project.id);
  const newer = index > 0 ? projects[index - 1] : null;
  const older = index < projects.length - 1 ? projects[index + 1] : null;

  const video = parseVideo(project.videoUrl);
  const when = formatDateRange(project.date, project.endDate);

  return (
    <article className="container">
      <header className={styles.header}>
        <p className={styles.back}>
          <Link href="/portfolio">Portfólio</Link>
        </p>
        <h1 className={styles.title}>{project.title}</h1>
        {project.description ? <p className={styles.lead}>{project.description}</p> : null}

        <dl className={styles.facts}>
          {when ? (
            <div>
              <dt>Data</dt>
              <dd>{when}</dd>
            </div>
          ) : null}
          {project.location ? (
            <div>
              <dt>Local</dt>
              <dd>{project.location}</dd>
            </div>
          ) : null}
          {project.category ? (
            <div>
              <dt>Categoria</dt>
              <dd>{project.category}</dd>
            </div>
          ) : null}
          {project.tags.length > 0 ? (
            <div>
              <dt>Tags</dt>
              <dd>{project.tags.join(", ")}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      {project.cover ? (
        <div className={styles.cover}>
          <MediaFrame media={project.cover} alt={project.title} className={styles.coverMedia} priority />
        </div>
      ) : null}

      {video ? (
        <div className={styles.cover}>
          <VideoEmbed video={video} title={project.title} />
        </div>
      ) : null}

      {blocks.length > 0 ? (
        <div className={styles.body}>
          <NotionBlocks blocks={blocks} />
        </div>
      ) : null}

      <nav className={styles.pager} aria-label="Outros projetos">
        {newer ? (
          <Link href={`/portfolio/${newer.slug}`} className={styles.pagerLink} rel="prev">
            <span className={styles.pagerLabel}>Mais recente</span>
            <span className={styles.pagerTitle}>{newer.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {older ? (
          <Link href={`/portfolio/${older.slug}`} className={`${styles.pagerLink} ${styles.pagerNext}`} rel="next">
            <span className={styles.pagerLabel}>Anterior</span>
            <span className={styles.pagerTitle}>{older.title}</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
