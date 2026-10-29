import { parseVideo } from "@/lib/media";
import styles from "./ProjectMedia.module.css";

/** Post ou reel do Instagram embutido, com link para abrir no app. */
export function InstagramEmbed({
  url,
  title,
  linkLabel = "Instagram",
}: {
  url: string;
  title: string;
  linkLabel?: string;
}) {
  const post = parseVideo(url);
  if (!post || post.provider !== "instagram") return null;

  return (
    <figure className={styles.instagram}>
      <iframe
        className={styles.instagramFrame}
        src={post.embedUrl}
        title={title}
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <figcaption className={styles.instagramCaption}>
        <a href={post.pageUrl} target="_blank" rel="noopener noreferrer">
          {linkLabel}
        </a>
      </figcaption>
    </figure>
  );
}
