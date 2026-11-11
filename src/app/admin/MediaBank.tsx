"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { isVideoUrl, type SiteContent } from "@/lib/content-types";
import styles from "./admin.module.css";

/**
 * Banco de mídias: tudo que já está em uso no conteúdo (fotos e capas dos
 * projetos, trabalhos da Art, arte do Sobre, vídeo da Home), para reaproveitar
 * sem precisar enviar de novo.
 */

export type BankItem = {
  src: string;
  kind: "image" | "video";
  /** Onde a mídia aparece (ex.: nome do projeto). */
  where: string[];
  alt: string;
  /** Texto juntado para a busca (lugares, descrição, título, categoria). */
  search: string;
};

export function collectMedia(content: SiteContent): BankItem[] {
  const items = new Map<string, BankItem>();
  const add = (src: string | undefined, where: string, alt = "", extra = "") => {
    if (!src) return;
    const text = `${where} ${alt} ${extra}`.toLowerCase();
    const found = items.get(src);
    if (found) {
      if (!found.where.includes(where)) found.where.push(where);
      if (!found.alt && alt) found.alt = alt;
      found.search += ` ${text}`;
      return;
    }
    items.set(src, { src, kind: isVideoUrl(src) ? "video" : "image", where: [where], alt, search: text });
  };

  for (const project of content.projects) {
    const name = project.title || "Projeto sem título";
    add(project.cover, name);
    for (const photo of project.photos) add(photo.src, name, photo.alt);
    for (const video of project.videos) if (isVideoUrl(video)) add(video, name);
  }
  for (const work of content.art) {
    const where = `Art · ${work.title || work.category}`;
    add(work.src, where, work.alt, work.category);
    add(work.poster, where, work.alt, work.category);
  }
  add(content.about.art, "Sobre");
  add(content.heroVideo, "Home");
  return [...items.values()];
}

const BankContext = createContext<BankItem[]>([]);

export function MediaBankProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  const items = useMemo(() => collectMedia(content), [content]);
  return <BankContext.Provider value={items}>{children}</BankContext.Provider>;
}

/** Botão "Escolher do banco" + janela de escolha. */
export function BankButton({
  accept,
  multiple = false,
  label = "Escolher do banco",
  exclude = [],
  onPick,
}: {
  accept: string;
  multiple?: boolean;
  label?: string;
  /** Mídias que já estão neste campo (aparecem marcadas como "já aqui"). */
  exclude?: string[];
  onPick: (items: BankItem[]) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={styles.ghost} onClick={() => setOpen(true)}>
        {label}
      </button>
      {open ? (
        <BankDialog
          accept={accept}
          multiple={multiple}
          exclude={exclude}
          onClose={() => setOpen(false)}
          onPick={(picked) => {
            setOpen(false);
            if (picked.length) onPick(picked);
          }}
        />
      ) : null}
    </>
  );
}

function BankDialog({
  accept,
  multiple,
  exclude,
  onClose,
  onPick,
}: {
  accept: string;
  multiple: boolean;
  exclude: string[];
  onClose: () => void;
  onPick: (items: BankItem[]) => void;
}) {
  const all = useContext(BankContext);
  const ref = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<"all" | "image" | "video">("all");
  const [selected, setSelected] = useState<string[]>([]);

  const allowImages = accept.includes("image");
  const allowVideos = accept.includes("video");
  const pool = all.filter((item) => (item.kind === "image" ? allowImages : allowVideos));
  const q = query.trim().toLowerCase();
  const shown = pool.filter(
    (item) =>
      (kind === "all" || item.kind === kind) &&
      (!q || item.search.includes(q)),
  );

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  function toggle(src: string) {
    if (!multiple) {
      onPick(pool.filter((item) => item.src === src));
      return;
    }
    setSelected((list) => (list.includes(src) ? list.filter((s) => s !== src) : [...list, src]));
  }

  return (
    <dialog
      ref={ref}
      className={styles.bank}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      <div className={styles.bankHead}>
        <h2 className={styles.sectionTitle}>Banco de mídias</h2>
        <input
          type="search"
          placeholder="Buscar por projeto, categoria ou descrição"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {allowImages && allowVideos ? (
          <div className={styles.tabs} role="group" aria-label="Tipo">
            {(
              [
                ["all", "Tudo"],
                ["image", "Fotos"],
                ["video", "Vídeos"],
              ] as const
            ).map(([value, text]) => (
              <button key={value} type="button" className={styles.chip} aria-pressed={kind === value} onClick={() => setKind(value)}>
                {text}
              </button>
            ))}
          </div>
        ) : null}
        <button type="button" className={styles.ghost} onClick={() => ref.current?.close()} aria-label="Fechar">
          ×
        </button>
      </div>

      <p className={styles.muted}>
        {shown.length} de {pool.length} · {multiple ? "clique para marcar uma ou várias" : "clique para escolher"}
      </p>

      <ul role="list" className={styles.bankGrid}>
        {shown.map((item) => {
          const order = selected.indexOf(item.src);
          const here = exclude.includes(item.src);
          return (
            <li key={item.src}>
              <button
                type="button"
                className={styles.bankItem}
                aria-pressed={order >= 0}
                title={item.where.join(" · ")}
                onClick={() => toggle(item.src)}
              >
                {item.kind === "video" ? (
                  <video src={item.src} muted playsInline preload="metadata" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element -- prévia no CMS
                  <img src={item.src} alt="" loading="lazy" />
                )}
                {order >= 0 ? <span className={styles.bankCheck}>{order + 1}</span> : null}
                {here ? <span className={styles.bankHere}>já aqui</span> : null}
                <span className={styles.bankWhere}>{item.where[0]}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {multiple ? (
        <div className={styles.bankFoot}>
          {selected.length ? (
            <button type="button" className={styles.ghost} onClick={() => setSelected([])}>
              Limpar seleção
            </button>
          ) : null}
          <button
            type="button"
            className={styles.primary}
            disabled={!selected.length}
            onClick={() => onPick(selected.map((src) => pool.find((item) => item.src === src)!))}
          >
            Usar {selected.length || ""} {selected.length === 1 ? "mídia" : "mídias"}
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
