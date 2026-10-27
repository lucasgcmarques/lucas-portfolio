import type { Media } from "@/lib/projects";

type Props = {
  media: Media;
  alt: string;
  className?: string;
  /** Vídeos de capa tocam sozinhos, sem som e em loop. */
  autoPlay?: boolean;
  priority?: boolean;
};

/** Mostra uma imagem ou um vídeo de capa no mesmo enquadramento. */
export function MediaFrame({ media, alt, className, autoPlay = true, priority = false }: Props) {
  if (media.kind === "video") {
    return (
      <video
        className={className}
        src={media.src}
        autoPlay={autoPlay}
        muted
        loop
        playsInline
        preload={autoPlay ? "auto" : "metadata"}
        aria-label={alt}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- imagens vêm do Notion/YouTube/Vimeo com URLs dinâmicas
    <img
      className={className}
      src={media.src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
