import type { Media } from "@/lib/projects";
import { site } from "@/lib/site";
import { MediaFrame } from "./MediaFrame";
import { WordmarkLetters } from "./WordmarkLetters";
import styles from "./HeroWordmark.module.css";

/**
 * A marca OLHO NEGRO ocupando a largura da tela, com o trabalho passando
 * por dentro das letras. Uma camada preta com as letras em branco fica por
 * cima do vídeo em modo "multiply": o branco deixa ver, o preto esconde.
 */
export function HeroWordmark({ media, role }: { media: Media | null; role: string }) {
  const [top, bottom] = site.wordmark;

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <h1 id="hero-title" className="visually-hidden">
        {site.name}, {site.person}, {role}
      </h1>

      <div className={styles.stage}>
        <div className={styles.media} aria-hidden="true">
          {media ? (
            <MediaFrame media={media} alt="" className={styles.mediaFill} priority />
          ) : (
            <div className={styles.beam} />
          )}
        </div>

        <WordmarkLetters lines={[top, bottom]} />
      </div>
    </section>
  );
}
