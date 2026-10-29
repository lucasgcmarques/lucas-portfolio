import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaFrame } from "@/components/MediaFrame";
import { ProjectMedia } from "@/components/ProjectMedia";
import { PixelLens } from "@/components/PixelLens";
import { NotionBlocks } from "@/components/notion/NotionBlocks";
import { VideoEmbed } from "@/components/notion/VideoEmbed";
import { formatDateRange } from "@/lib/format";
import { getDictionary, hasLocale, href, locales } from "@/lib/i18n";
import { parseVideo } from "@/lib/media";
import { getBlocks, getProjectBySlug, getProjects, type Media } from "@/lib/projects";
import styles from "./project.module.css";

export const revalidate = 600;
/** Projetos novos no Notion ganham página sem precisar de um novo deploy. */
export const dynamicParams = true;

type Props = PageProps<"/[lang]/portfolio/[slug]">;

export async function generateStaticParams() {
  const projects = await getProjects();
  return locales.flatMap((lang) => projects.map((project) => ({ lang, slug: project.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const project = await getProjectBySlug(slug);
  if (!project) return { title: getDictionary(lang).project.notFound };

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
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.project;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [blocks, projects] = await Promise.all([getBlocks(project.id), getProjects()]);
  const index = projects.findIndex((p) => p.id === project.id);
  const newer = index > 0 ? projects[index - 1] : null;
  const older = index < projects.length - 1 ? projects[index + 1] : null;

  const video = parseVideo(project.videoUrl);
  // Sem Capa no Notion, a primeira foto guardada no site vira a capa.
  const localCover: Media | null =
    !project.cover && project.photos[0] ? { kind: "image", src: project.photos[0].src } : null;
  const cover = project.cover ?? localCover;
  const when = formatDateRange(project.date, project.endDate, dict.dateLocale);

  return (
    <article className="container">
      <header className={styles.header}>
        <p className={styles.back}>
          <Link href={href(lang, "/portfolio")}>{dict.portfolio.title}</Link>
        </p>
        <h1 className={styles.title}>{project.title}</h1>
        {project.description ? <p className={styles.lead}>{project.description}</p> : null}

        <dl className={styles.facts}>
          {when ? (
            <div>
              <dt>{t.date}</dt>
              <dd>{when}</dd>
            </div>
          ) : null}
          {project.location ? (
            <div>
              <dt>{t.location}</dt>
              <dd>{project.location}</dd>
            </div>
          ) : null}
          {project.category ? (
            <div>
              <dt>{t.category}</dt>
              <dd>{project.category}</dd>
            </div>
          ) : null}
          {project.tags.length > 0 ? (
            <div>
              <dt>{t.tags}</dt>
              <dd>{project.tags.join(", ")}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      {cover ? (
        <PixelLens className={styles.cover} radius={240} pixel={16}>
          <MediaFrame media={cover} alt={project.photos[0]?.alt || project.title} className={styles.coverMedia} priority />
        </PixelLens>
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

      <ProjectMedia
        project={project}
        skipFirstPhoto={Boolean(localCover)}
        labels={{ instagram: t.instagram, photos: t.photos, openInstagram: t.openInstagram }}
      />

      <nav className={styles.pager} aria-label={t.others}>
        {newer ? (
          <Link href={href(lang, `/portfolio/${newer.slug}`)} className={styles.pagerLink} rel="prev">
            <span className={styles.pagerLabel}>{t.newer}</span>
            <span className={styles.pagerTitle}>{newer.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {older ? (
          <Link href={href(lang, `/portfolio/${older.slug}`)} className={`${styles.pagerLink} ${styles.pagerNext}`} rel="next">
            <span className={styles.pagerLabel}>{t.older}</span>
            <span className={styles.pagerTitle}>{older.title}</span>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
