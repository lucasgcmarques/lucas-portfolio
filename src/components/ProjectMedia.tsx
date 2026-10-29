import type { Project } from "@/lib/projects";
import { InstagramEmbed } from "./InstagramEmbed";
import styles from "./ProjectMedia.module.css";

/** Fotos do projeto (exceto a capa) e posts do Instagram escolhidos. */
type Labels = { instagram: string; photos: string; openInstagram: string };

export function ProjectMedia({
  project,
  skipFirstPhoto,
  labels,
}: {
  project: Project;
  skipFirstPhoto: boolean;
  labels: Labels;
}) {
  const photos = skipFirstPhoto ? project.photos.slice(1) : project.photos;
  if (photos.length === 0 && project.instagram.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      {project.instagram.length > 0 ? (
        <section aria-labelledby="instagram" className={styles.section}>
          <h2 id="instagram" className={styles.title}>
            {labels.instagram}
          </h2>
          <div className={styles.instagramGrid}>
            {project.instagram.map((url, index) => (
              <InstagramEmbed
                key={url}
                url={url}
                title={`${project.title} (${index + 1})`}
                linkLabel={labels.openInstagram}
              />
            ))}
          </div>
        </section>
      ) : null}

      {photos.length > 0 ? (
        <section aria-labelledby="fotos" className={styles.section}>
          <h2 id="fotos" className={styles.title}>
            {labels.photos}
          </h2>
          <div className={styles.gallery}>
            {photos.map((photo) => (
              <a key={photo.src} href={photo.src} target="_blank" rel="noopener" className={styles.photoLink}>
                {/* eslint-disable-next-line @next/next/no-img-element -- fotos estáticas do próprio site */}
                <img className={styles.photo} src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
