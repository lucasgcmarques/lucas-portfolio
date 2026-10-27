import type { Media } from "@/lib/projects";
import { site } from "@/lib/site";
import { MediaFrame } from "./MediaFrame";
import styles from "./HeroWordmark.module.css";

/**
 * A marca OLHO NEGRO ocupando a largura da tela, com o trabalho passando
 * por dentro das letras. Uma camada preta com as letras em branco fica por
 * cima do vídeo em modo "multiply": o branco deixa ver, o preto esconde.
 */
export function HeroWordmark({ media }: { media: Media | null }) {
  const [top, bottom] = site.wordmark;

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <h1 id="hero-title" className="visually-hidden">
        {site.name}, {site.person}, {site.role}
      </h1>

      <div className={styles.stage}>
        <div className={styles.media} aria-hidden="true">
          {media ? (
            <MediaFrame media={media} alt="" className={styles.mediaFill} priority />
          ) : (
            <div className={styles.beam} />
          )}
        </div>

        <svg
          className={styles.mask}
          viewBox="0 0 1000 560"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
        >
          <rect width="1000" height="560" fill="#000" />
          <text className={styles.letters} x="0" y="258" textLength="1000" lengthAdjust="spacingAndGlyphs">
            {top}
          </text>
          <text className={styles.letters} x="0" y="540" textLength="1000" lengthAdjust="spacingAndGlyphs">
            {bottom}
          </text>
        </svg>
      </div>
    </section>
  );
}
