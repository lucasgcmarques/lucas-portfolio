import type { VideoSource } from "@/lib/media";
import styles from "./NotionBlocks.module.css";

/** Player de vídeo responsivo (16:9) para YouTube, Vimeo, Google Drive ou arquivo. */
export function VideoEmbed({ video, title }: { video: VideoSource; title: string }) {
  if (video.provider === "file") {
    return (
      <div className={styles.videoFrame}>
        <video className={styles.videoFill} src={video.src} controls playsInline preload="metadata" title={title} />
      </div>
    );
  }

  return (
    <div className={styles.videoFrame}>
      <iframe
        className={styles.videoFill}
        src={video.embedUrl}
        title={title}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
