"use client";

import { useEffect, useRef, useState } from "react";
import { artCategories, type ArtCategory, type ArtWork } from "@/lib/art";
import { PixelLens } from "./PixelLens";
import filterStyles from "./PortfolioGrid.module.css";
import styles from "./ArtMosaic.module.css";

type Labels = {
  all: string;
  filterLabel: string;
  countWord: string;
  empty: string;
  expand: string;
  close: string;
  previous: string;
  next: string;
};

// Quantos blocos entram de cada vez: os primeiros na carga, os outros
// conforme a rolagem se aproxima do fim do mosaico.
const BATCH = 8;

export function ArtMosaic({ works, labels }: { works: ArtWork[]; labels: Labels }) {
  const [active, setActive] = useState<ArtCategory | null>(null);
  const [shown, setShown] = useState(BATCH);
  // Trabalho aberto em tela cheia (posição dentro da lista filtrada).
  const [open, setOpen] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = active === null ? works : works.filter((work) => work.category === active);
  const visible = filtered.slice(0, shown);
  const hasMore = shown < filtered.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown((count) => count + BATCH);
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, shown]);

  function choose(category: ArtCategory | null) {
    setActive(category);
    setShown(BATCH);
  }

  return (
    <>
      <div className={filterStyles.filters} role="group" aria-label={labels.filterLabel}>
        {[null, ...artCategories].map((category) => (
          <button
            key={category ?? "all"}
            type="button"
            className={filterStyles.filter}
            aria-pressed={active === category}
            onClick={() => choose(category)}
          >
            {category ?? labels.all}
            <span className={filterStyles.count}>
              {category === null ? works.length : works.filter((work) => work.category === category).length}
            </span>
          </button>
        ))}
      </div>

      <p className="visually-hidden" aria-live="polite">
        {filtered.length} {labels.countWord}
      </p>

      {filtered.length > 0 ? (
        <ul role="list" className={styles.mosaic}>
          {visible.map((work, index) => (
            <li
              key={work.src}
              className={styles.tile}
              data-size={work.size ?? "small"}
              // Cada lote surge bloco a bloco, saindo de um desfoque.
              style={{ "--i": index % BATCH } as React.CSSProperties}
            >
              <button
                type="button"
                className={styles.open}
                aria-label={`${labels.expand}: ${work.title || work.alt}`}
                onClick={() => setOpen(index)}
              >
                <PixelLens className={styles.frame} radius={180} pixel={12}>
                  {work.kind === "video" ? (
                    <ArtVideo src={work.src} poster={work.poster} label={work.alt} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element -- arquivos estáticos do próprio site
                    <img className={styles.media} src={work.src} alt={work.alt} loading="lazy" decoding="async" />
                  )}
                </PixelLens>
              </button>
              <p className={styles.caption}>
                {work.title ? <span>{work.title}</span> : null}
                <span className={styles.category}>{work.category}</span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={filterStyles.empty}>{labels.empty}</p>
      )}

      {hasMore ? <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" /> : null}

      {open !== null && filtered[open] ? (
        <Lightbox
          works={filtered}
          index={open}
          labels={labels}
          onMove={(delta) => setOpen((i) => (i === null ? i : (i + delta + filtered.length) % filtered.length))}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </>
  );
}

/** Vídeo em loop, sem som, que só toca enquanto está na tela. */
function ArtVideo({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduced) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={styles.media}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      // Com miniatura, só baixa o vídeo quando ele aparece na tela.
      preload={poster ? "none" : "metadata"}
      aria-label={label}
    />
  );
}

/**
 * Trabalho em tela cheia. Setas (na tela ou no teclado) e o gesto de
 * arrastar para o lado passam para o anterior/próximo; Esc ou o fundo fecham.
 */
function Lightbox({
  works,
  index,
  labels,
  onMove,
  onClose,
}: {
  works: ArtWork[];
  index: number;
  labels: Labels;
  onMove: (delta: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const work = works[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") onMove(1);
      if (event.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onMove]);

  // Já carrega as imagens vizinhas para a troca ser imediata.
  useEffect(() => {
    for (const delta of [1, -1]) {
      const next = works[(index + delta + works.length) % works.length];
      if (next.kind === "image") new Image().src = next.src;
    }
  }, [index, works]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.lightbox}
      aria-label={work.title || work.alt}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      onTouchStart={(event) => (touchX.current = event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchX.current === null) return;
        const dx = event.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) onMove(dx < 0 ? 1 : -1);
      }}
    >
      <figure className={styles.stage} key={work.src}>
        {work.kind === "video" ? (
          <video className={styles.full} src={work.src} poster={work.poster} autoPlay muted loop playsInline aria-label={work.alt} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- arquivos estáticos do próprio site
          <img className={styles.full} src={work.src} alt={work.alt} />
        )}
        <figcaption className={styles.fullCaption}>
          {work.title ? <span>{work.title}</span> : null}
          <span className={styles.category}>{work.category}</span>
          <span className={styles.counter}>
            {index + 1} / {works.length}
          </span>
        </figcaption>
      </figure>

      <button type="button" className={`${styles.nav} ${styles.prev}`} aria-label={labels.previous} onClick={() => onMove(-1)}>
        ←
      </button>
      <button type="button" className={`${styles.nav} ${styles.next}`} aria-label={labels.next} onClick={() => onMove(1)}>
        →
      </button>
      <button type="button" className={styles.close} aria-label={labels.close} onClick={() => dialogRef.current?.close()}>
        ×
      </button>
    </dialog>
  );
}
