"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Lightbox.module.css";

export type LightboxItem = {
  src: string;
  kind: "image" | "video";
  poster?: string;
  alt: string;
  /** Textos da legenda (ex.: título e categoria), na ordem. */
  caption?: string[];
};

export type LightboxLabels = { close: string; previous: string; next: string };

/**
 * Item em tela cheia. Setas (na tela ou no teclado) e o gesto de arrastar
 * para o lado passam para o anterior/próximo; Esc ou o fundo fecham.
 */
export function Lightbox({
  items,
  index,
  labels,
  onMove,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  labels: LightboxLabels;
  onMove: (delta: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const item = items[index];
  const many = items.length > 1;

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
      const next = items[(index + delta + items.length) % items.length];
      if (next.kind === "image") new Image().src = next.src;
    }
  }, [index, items]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.lightbox}
      aria-label={item.caption?.[0] || item.alt}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      onTouchStart={(event) => (touchX.current = event.touches[0].clientX)}
      onTouchEnd={(event) => {
        if (touchX.current === null) return;
        const dx = event.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (many && Math.abs(dx) > 50) onMove(dx < 0 ? 1 : -1);
      }}
    >
      <figure className={styles.stage} key={item.src}>
        {item.kind === "video" ? (
          <video className={styles.full} src={item.src} poster={item.poster} autoPlay muted loop playsInline controls aria-label={item.alt} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- arquivos estáticos do próprio site
          <img className={styles.full} src={item.src} alt={item.alt} />
        )}
        <figcaption className={styles.fullCaption}>
          {item.caption?.map((text, i) =>
            text ? (
              <span key={i} className={i > 0 ? styles.meta : undefined}>
                {text}
              </span>
            ) : null,
          )}
          {many ? (
            <span className={styles.counter}>
              {index + 1} / {items.length}
            </span>
          ) : null}
        </figcaption>
      </figure>

      {many ? (
        <>
          <button type="button" className={`${styles.nav} ${styles.prev}`} aria-label={labels.previous} onClick={() => onMove(-1)}>
            ←
          </button>
          <button type="button" className={`${styles.nav} ${styles.next}`} aria-label={labels.next} onClick={() => onMove(1)}>
            →
          </button>
        </>
      ) : null}
      <button type="button" className={styles.close} aria-label={labels.close} onClick={() => dialogRef.current?.close()}>
        ×
      </button>
    </dialog>
  );
}

/**
 * Liga o lightbox a conteúdo renderizado no servidor: qualquer elemento
 * dentro com data-lightbox="<índice>" abre o item correspondente ao clique.
 */
export function LightboxGroup({
  items,
  labels,
  children,
}: {
  items: LightboxItem[];
  labels: LightboxLabels;
  children: ReactNode;
}) {
  const [open, setOpen] = useState<number | null>(null);

  function openFrom(target: EventTarget) {
    const el = (target as HTMLElement).closest?.("[data-lightbox]");
    if (!el) return false;
    const i = Number(el.getAttribute("data-lightbox"));
    if (!Number.isInteger(i) || !items[i]) return false;
    setOpen(i);
    return true;
  }

  return (
    <div
      onClick={(event) => {
        if (openFrom(event.target)) event.preventDefault();
      }}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && openFrom(event.target)) event.preventDefault();
      }}
    >
      {children}
      {open !== null ? (
        <Lightbox
          items={items}
          index={open}
          labels={labels}
          onMove={(delta) => setOpen((i) => (i === null ? i : (i + delta + items.length) % items.length))}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </div>
  );
}
