"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { artCategories } from "@/lib/art";
import {
  isVideoUrl,
  newId,
  type ArtEntry,
  type ContactContent,
  type Photo,
  type ProjectEntry,
  type SiteContent,
} from "@/lib/content-types";
import { logout, saveContent } from "./actions";
import { uploadMedia } from "./upload";
import styles from "./admin.module.css";

type Tab = "portfolio" | "art" | "about" | "contact" | "hero";

const TABS: { id: Tab; label: string }[] = [
  { id: "portfolio", label: "Portfólio" },
  { id: "art", label: "Art" },
  { id: "about", label: "Sobre" },
  { id: "contact", label: "Contato" },
  { id: "hero", label: "Home" },
];

const SIZES: { value: ArtEntry["size"]; label: string }[] = [
  { value: "small", label: "Pequeno" },
  { value: "wide", label: "Largo" },
  { value: "tall", label: "Alto" },
  { value: "large", label: "Grande" },
];

function move<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function AdminEditor({
  initial,
  firstSave,
  blobReady,
}: {
  initial: SiteContent;
  firstSave: boolean;
  blobReady: boolean;
}) {
  const [content, setContent] = useState(initial);
  const [saved, setSaved] = useState(JSON.stringify(initial));
  const [tab, setTab] = useState<Tab>("portfolio");
  const [status, setStatus] = useState<string | null>(
    firstSave ? "Este é o conteúdo atual do site. Salve uma vez para o site passar a usar o CMS." : null,
  );
  const [saving, startSaving] = useTransition();
  const dirty = JSON.stringify(content) !== saved;

  // Aviso ao fechar a aba com alterações não salvas.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function save() {
    startSaving(async () => {
      const result = await saveContent(content);
      if (result.ok) {
        setSaved(JSON.stringify(content));
        setStatus(`Salvo às ${new Date(result.savedAt!).toLocaleTimeString("pt-BR")}. O site já foi atualizado.`);
      } else {
        setStatus(result.error ?? "Erro ao salvar.");
      }
    });
  }

  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <p className={styles.brand}>Olho Negro · CMS</p>
        <nav className={styles.tabs} aria-label="Seções">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={styles.tab}
              aria-pressed={tab === item.id}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className={styles.topActions}>
          <a href="/" target="_blank" rel="noopener" className={styles.ghost}>
            Ver site
          </a>
          <button type="button" className={styles.primary} onClick={save} disabled={saving || (!dirty && !firstSave) || !blobReady}>
            {saving ? "Salvando…" : dirty ? "Salvar alterações" : "Salvar"}
          </button>
          <form action={logout}>
            <button type="submit" className={styles.ghost}>
              Sair
            </button>
          </form>
        </div>
      </header>

      {!blobReady ? (
        <p className={styles.banner}>
          O armazenamento não está configurado aqui: falta <code>BLOB_READ_WRITE_TOKEN</code> no <code>.env.local</code>.
          Dá para ver o conteúdo, mas não salvar nem enviar arquivos.
        </p>
      ) : null}
      {status ? (
        <p className={styles.banner} role="status">
          {status}
        </p>
      ) : null}

      <main className={styles.main}>
        {tab === "portfolio" ? (
          <ProjectsEditor
            projects={content.projects}
            onChange={(projects) => setContent((c) => ({ ...c, projects }))}
          />
        ) : null}
        {tab === "art" ? (
          <ArtEditor works={content.art} onChange={(art) => setContent((c) => ({ ...c, art }))} />
        ) : null}
        {tab === "about" ? (
          <section className={styles.form}>
            <h2 className={styles.sectionTitle}>Sobre</h2>
            {(["pt", "en", "fr"] as const).map((lang) => (
              <label key={lang} className={styles.field}>
                <span>Bio ({lang.toUpperCase()}) · parágrafos separados por uma linha em branco</span>
                <textarea
                  rows={9}
                  value={content.about.bio[lang]}
                  onChange={(e) =>
                    setContent((c) => ({ ...c, about: { ...c.about, bio: { ...c.about.bio, [lang]: e.target.value } } }))
                  }
                />
              </label>
            ))}
            <MediaField
              label="Arte da página"
              value={content.about.art}
              accept="image/*"
              onChange={(art) => setContent((c) => ({ ...c, about: { ...c.about, art } }))}
            />
            <TextField
              label="Descrição da arte (acessibilidade)"
              value={content.about.artAlt}
              onChange={(artAlt) => setContent((c) => ({ ...c, about: { ...c.about, artAlt } }))}
            />
            <label className={styles.field}>
              <span>Palcos e artistas (Home) · um por linha</span>
              <textarea
                rows={8}
                value={content.about.credits.join("\n")}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    about: { ...c.about, credits: e.target.value.split("\n") },
                  }))
                }
                onBlur={() =>
                  setContent((c) => ({
                    ...c,
                    about: { ...c.about, credits: c.about.credits.map((s) => s.trim()).filter(Boolean) },
                  }))
                }
              />
            </label>
          </section>
        ) : null}
        {tab === "contact" ? (
          <ContactEditor contact={content.contact} onChange={(contact) => setContent((c) => ({ ...c, contact }))} />
        ) : null}
        {tab === "hero" ? (
          <section className={styles.form}>
            <h2 className={styles.sectionTitle}>Home</h2>
            <MediaField
              label="Vídeo dentro das letras OLHO NEGRO"
              value={content.heroVideo}
              accept="video/*,image/*"
              onChange={(heroVideo) => setContent((c) => ({ ...c, heroVideo }))}
            />
            <p className={styles.muted}>Os projetos em destaque da Home são os marcados como “Destaque” no Portfólio.</p>
          </section>
        ) : null}
      </main>
    </div>
  );
}

/* ---------- Portfólio ---------- */

function emptyProject(): ProjectEntry {
  return {
    id: newId(),
    slug: "",
    title: "Novo projeto",
    description: "",
    body: "",
    category: "",
    tags: [],
    date: new Date().toISOString().slice(0, 10),
    endDate: "",
    location: "",
    featured: false,
    published: false,
    cover: "",
    photos: [],
    videos: [],
    instagram: [],
  };
}

function ProjectsEditor({ projects, onChange }: { projects: ProjectEntry[]; onChange: (p: ProjectEntry[]) => void }) {
  const [selected, setSelected] = useState<string | null>(projects[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const project = projects.find((p) => p.id === selected) ?? null;
  const categories = useMemo(() => [...new Set(projects.map((p) => p.category).filter(Boolean))], [projects]);
  const sorted = [...projects].sort((a, b) => b.date.localeCompare(a.date));
  const visible = sorted.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

  function update(patch: Partial<ProjectEntry>) {
    if (!project) return;
    onChange(projects.map((p) => (p.id === project.id ? { ...p, ...patch } : p)));
  }

  function add() {
    const fresh = emptyProject();
    onChange([fresh, ...projects]);
    setSelected(fresh.id);
  }

  function remove() {
    if (!project || !confirm(`Apagar “${project.title}”? Dá para desfazer só fechando sem salvar.`)) return;
    onChange(projects.filter((p) => p.id !== project.id));
    setSelected(null);
  }

  return (
    <div className={styles.split}>
      <aside className={styles.sidebar}>
        <button type="button" className={styles.primary} onClick={add}>
          + Novo projeto
        </button>
        <input
          type="search"
          placeholder="Buscar projeto"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.search}
        />
        <ul role="list" className={styles.list}>
          {visible.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={styles.listItem}
                aria-current={p.id === selected ? "true" : undefined}
                onClick={() => setSelected(p.id)}
              >
                <span>{p.title || "Sem título"}</span>
                <span className={styles.muted}>
                  {p.date.slice(0, 4)}
                  {p.published ? "" : " · oculto"}
                  {p.featured ? " · destaque" : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {project ? (
        <section className={styles.form} key={project.id}>
          <div className={styles.row}>
            <h2 className={styles.sectionTitle}>{project.title || "Sem título"}</h2>
            <button type="button" className={styles.danger} onClick={remove}>
              Apagar projeto
            </button>
          </div>
          <div className={styles.checks}>
            <label>
              <input type="checkbox" checked={project.published} onChange={(e) => update({ published: e.target.checked })} />
              Publicado (desmarque para ocultar do site)
            </label>
            <label>
              <input type="checkbox" checked={project.featured} onChange={(e) => update({ featured: e.target.checked })} />
              Destaque na Home
            </label>
          </div>
          <TextField label="Título" value={project.title} onChange={(title) => update({ title })} />
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span>Categoria</span>
              <input list="categorias" value={project.category} onChange={(e) => update({ category: e.target.value })} />
              <datalist id="categorias">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
            <TextField
              label="Endereço (fim da URL; vazio = gerado do título)"
              value={project.slug}
              onChange={(slug) => update({ slug })}
            />
            <TextField label="Data" type="date" value={project.date} onChange={(date) => update({ date })} />
            <TextField label="Data final (opcional)" type="date" value={project.endDate} onChange={(endDate) => update({ endDate })} />
          </div>
          <TextField label="Local" value={project.location} onChange={(location) => update({ location })} />
          <label className={styles.field}>
            <span>Resumo (abaixo do título)</span>
            <textarea rows={3} value={project.description} onChange={(e) => update({ description: e.target.value })} />
          </label>
          <label className={styles.field}>
            <span>Texto da página · parágrafos separados por uma linha em branco</span>
            <textarea rows={8} value={project.body} onChange={(e) => update({ body: e.target.value })} />
          </label>
          <TextField
            label="Tags (separadas por vírgula)"
            value={project.tags.join(", ")}
            onChange={(value) => update({ tags: value.split(",").map((t) => t.trim()).filter(Boolean) })}
          />
          <MediaField
            label="Capa (imagem ou vídeo; vazio = primeira foto)"
            value={project.cover}
            accept="image/*,video/*"
            onChange={(cover) => update({ cover })}
          />
          <PhotosField photos={project.photos} onChange={(photos) => update({ photos })} />
          <LinksField
            label="Vídeos (link do YouTube/Vimeo ou envio do computador; no YouTube, &t=62 começa em 1:02)"
            links={project.videos}
            uploadAccept="video/*"
            onChange={(videos) => update({ videos })}
          />
          <LinksField
            label="Posts do Instagram"
            links={project.instagram}
            onChange={(instagram) => update({ instagram })}
          />
        </section>
      ) : (
        <p className={styles.muted}>Escolha um projeto na lista ou crie um novo.</p>
      )}
    </div>
  );
}

/* ---------- Art ---------- */

/** Espalha as categorias ao longo do mosaico, mantendo a ordem dentro de cada uma. */
function interleave(works: ArtEntry[]): ArtEntry[] {
  const groups = new Map<string, ArtEntry[]>();
  for (const work of works) groups.set(work.category, [...(groups.get(work.category) ?? []), work]);
  const position = new Map<string, number>();
  for (const group of groups.values()) group.forEach((work, i) => position.set(work.id, (i + 0.5) / group.length));
  return [...works].sort((a, b) => position.get(a.id)! - position.get(b.id)!);
}

function ArtEditor({ works, onChange }: { works: ArtEntry[]; onChange: (w: ArtEntry[]) => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [filter, setFilter] = useState<ArtEntry["category"] | null>(null);
  // Arrastar e soltar: qual cartão está sendo arrastado e sobre qual ele está.
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  /** Tira o cartão arrastado do lugar e o põe na posição do cartão alvo. */
  function drop(targetId: string) {
    setOverId(null);
    if (!dragId || dragId === targetId) return;
    const from = works.findIndex((w) => w.id === dragId);
    const to = works.findIndex((w) => w.id === targetId);
    const next = [...works];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }
  const inputRef = useRef<HTMLInputElement>(null);

  function update(id: string, patch: Partial<ArtEntry>) {
    onChange(works.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const added: ArtEntry[] = [];
    try {
      for (const [index, file] of [...files].entries()) {
        const { url, kind } = await uploadMedia(file, (p) =>
          setBusy(`Enviando ${index + 1} de ${files.length}: ${Math.round(p)}%`),
        );
        added.push({
          id: newId(),
          src: url,
          kind,
          category: kind === "video" ? "Video Art" : "Digital Art",
          alt: "",
          title: "",
          size: "small",
        });
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Falha no envio");
    } finally {
      setBusy(null);
      if (added.length) onChange([...added, ...works]);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <section>
      <div className={styles.row}>
        <h2 className={styles.sectionTitle}>
          Art · {works.length} trabalhos
          {works.some((w) => w.hidden) ? ` (${works.filter((w) => w.hidden).length} ocultos)` : ""}
        </h2>
        <span className={styles.inline}>
          <button type="button" className={styles.ghost} onClick={() => onChange(interleave(works))}>
            Intercalar categorias
          </button>
          <label className={styles.primary}>
            {busy ?? "+ Enviar imagens e vídeos"}
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              hidden
              disabled={Boolean(busy)}
              onChange={(e) => addFiles(e.target.files)}
            />
          </label>
        </span>
      </div>
      <div className={styles.artToolbar}>
        <div className={styles.tabs} role="group" aria-label="Filtrar por categoria">
          {[null, ...artCategories].map((c) => (
            <button
              key={c ?? "all"}
              type="button"
              className={styles.chip}
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c ?? "Todas"} <span className={styles.muted}>{c ? works.filter((w) => w.category === c).length : works.length}</span>
            </button>
          ))}
        </div>
        <p className={styles.muted}>O número é a posição no mosaico. Arraste pela imagem para reordenar (ou use ← →).</p>
      </div>
      <ul role="list" className={styles.cards}>
        {works.map((work, index) =>
          filter && work.category !== filter ? null : (
            <li
              key={work.id}
              className={styles.cardItem}
              data-hidden={work.hidden || undefined}
              data-dragging={dragId === work.id || undefined}
              data-over={(overId === work.id && dragId !== work.id) || undefined}
              onDragOver={(e) => {
                if (!dragId) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (overId !== work.id) setOverId(work.id);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverId((id) => (id === work.id ? null : id));
              }}
              onDrop={(e) => {
                e.preventDefault();
                drop(work.id);
              }}
            >
              {/* A miniatura é a alça: arrastar por ela não atrapalha os campos de texto. */}
              <div
                className={styles.thumb}
                draggable
                title="Arraste para reordenar"
                onDragStart={(e) => {
                  setDragId(work.id);
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", work.id);
                  const card = e.currentTarget.closest("li");
                  if (card) e.dataTransfer.setDragImage(card, 40, 30);
                }}
                onDragEnd={() => {
                  setDragId(null);
                  setOverId(null);
                }}
              >
                {work.kind === "video" ? <VideoThumb src={work.src} poster={work.poster} /> : <Preview src={work.src} />}
                <span className={styles.badgeNum}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.badges}>
                  {work.kind === "video" ? <span className={styles.badge}>Vídeo</span> : null}
                  {work.hidden ? <span className={`${styles.badge} ${styles.badgeOff}`}>Oculto</span> : null}
                </span>
              </div>

              <div className={styles.cardFields}>
                <input
                  className={styles.titleInput}
                  value={work.title}
                  placeholder="Sem título"
                  aria-label="Título"
                  onChange={(e) => update(work.id, { title: e.target.value })}
                />
                <div className={styles.selects}>
                  <select
                    aria-label="Categoria"
                    value={work.category}
                    onChange={(e) => update(work.id, { category: e.target.value as ArtEntry["category"] })}
                  >
                    {artCategories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    aria-label="Tamanho no mosaico"
                    value={work.size}
                    onChange={(e) => update(work.id, { size: e.target.value as ArtEntry["size"] })}
                  >
                    {SIZES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <details className={styles.more}>
                  <summary>
                    Detalhes
                    {!work.alt ? <span className={styles.warn}> · falta descrição</span> : null}
                    {work.kind === "video" && !work.poster ? <span className={styles.warn}> · sem miniatura</span> : null}
                  </summary>
                  <div className={styles.moreBody}>
                    <TextField label="Descrição (acessibilidade)" value={work.alt} onChange={(alt) => update(work.id, { alt })} />
                    {work.kind === "video" ? (
                      <div className={styles.field}>
                        <span>Miniatura do vídeo</span>
                        <div className={styles.posterRow}>
                          {work.poster ? (
                            // eslint-disable-next-line @next/next/no-img-element -- prévia no CMS
                            <img className={styles.posterThumb} src={work.poster} alt="" loading="lazy" />
                          ) : (
                            <span className={styles.posterThumb} />
                          )}
                          <UploadButton
                            accept="image/*"
                            label={work.poster ? "Trocar" : "Enviar"}
                            onUploaded={([file]) => update(work.id, { poster: file.url })}
                          />
                          {work.poster ? (
                            <button type="button" className={styles.ghost} onClick={() => update(work.id, { poster: "" })}>
                              Limpar
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </details>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.inline}>
                  <button
                    type="button"
                    className={styles.icon}
                    disabled={index === 0}
                    onClick={() => onChange(move(works, index, -1))}
                    aria-label="Mover para antes"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className={styles.icon}
                    disabled={index === works.length - 1}
                    onClick={() => onChange(move(works, index, 1))}
                    aria-label="Mover para depois"
                  >
                    →
                  </button>
                </span>
                <span className={styles.inline}>
                  <button
                    type="button"
                    className={styles.ghost}
                    aria-pressed={Boolean(work.hidden)}
                    onClick={() => update(work.id, { hidden: !work.hidden })}
                  >
                    {work.hidden ? "Mostrar" : "Ocultar"}
                  </button>
                  <button
                    type="button"
                    className={styles.danger}
                    onClick={() => confirm("Tirar este trabalho da página Art?") && onChange(works.filter((w) => w.id !== work.id))}
                  >
                    Remover
                  </button>
                </span>
              </div>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}

/* ---------- Contato ---------- */

function ContactEditor({ contact, onChange }: { contact: ContactContent; onChange: (c: ContactContent) => void }) {
  const set = (patch: Partial<ContactContent>) => onChange({ ...contact, ...patch });
  return (
    <section className={styles.form}>
      <h2 className={styles.sectionTitle}>Contato</h2>
      <TextField label="E-mail" type="email" value={contact.email} onChange={(email) => set({ email })} />
      <div className={styles.grid2}>
        <TextField label="Telefone (como aparece)" value={contact.phoneDisplay} onChange={(phoneDisplay) => set({ phoneDisplay })} />
        <TextField label="Link do WhatsApp (https://wa.me/55…)" value={contact.whatsapp} onChange={(whatsapp) => set({ whatsapp })} />
        <TextField label="Instagram (@usuário)" value={contact.instagramHandle} onChange={(instagramHandle) => set({ instagramHandle })} />
        <TextField label="Link do Instagram" value={contact.instagramUrl} onChange={(instagramUrl) => set({ instagramUrl })} />
      </div>
      <fieldset className={styles.fieldset}>
        <legend>Outros canais (Vimeo, YouTube, LinkedIn…)</legend>
        {contact.others.map((channel, index) => (
          <div key={index} className={styles.inline}>
            <input
              placeholder="Nome"
              value={channel.label}
              onChange={(e) => set({ others: contact.others.map((c, i) => (i === index ? { ...c, label: e.target.value } : c)) })}
            />
            <input
              placeholder="https://…"
              value={channel.url}
              onChange={(e) => set({ others: contact.others.map((c, i) => (i === index ? { ...c, url: e.target.value } : c)) })}
            />
            <button type="button" className={styles.danger} onClick={() => set({ others: contact.others.filter((_, i) => i !== index) })}>
              ×
            </button>
          </div>
        ))}
        <button type="button" className={styles.ghost} onClick={() => set({ others: [...contact.others, { label: "", url: "" }] })}>
          + Canal
        </button>
      </fieldset>
    </section>
  );
}

/* ---------- Campos ---------- */

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Preview({ src, poster }: { src: string; poster?: string }) {
  if (!src) return <div className={styles.preview} />;
  if (isVideoUrl(src))
    return <video className={styles.preview} src={src} poster={poster} muted loop playsInline preload={poster ? "none" : "metadata"} />;
  // eslint-disable-next-line @next/next/no-img-element -- prévia no CMS
  return <img className={styles.preview} src={src} alt="" loading="lazy" />;
}

/**
 * Vídeo do cartão: um clique toca/pausa ali mesmo, pequeno; o botão do
 * canto abre em tela cheia (com controles e som).
 */
function VideoThumb({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Ao sair da tela cheia, volta a ser a miniatura sem controles.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const onChange = () => {
      if (!document.fullscreenElement) video.controls = false;
    };
    video.addEventListener("fullscreenchange", onChange);
    return () => video.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggle() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  function expand() {
    const video = ref.current;
    if (!video) return;
    video.controls = true;
    video.play().catch(() => {});
    video.requestFullscreen?.().catch(() => {});
  }

  return (
    <>
      <video
        ref={ref}
        className={styles.preview}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload={poster ? "none" : "metadata"}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={toggle}
      />
      <button
        type="button"
        className={`${styles.thumbBtn} ${styles.playBtn}`}
        data-playing={playing || undefined}
        aria-label={playing ? "Pausar" : "Tocar"}
        onClick={toggle}
      >
        {playing ? "❚❚" : "▶"}
      </button>
      <button type="button" className={`${styles.thumbBtn} ${styles.expandBtn}`} aria-label="Tela cheia" onClick={expand}>
        ⤢
      </button>
    </>
  );
}

function UploadButton({
  accept,
  multiple = false,
  label,
  onUploaded,
}: {
  accept: string;
  multiple?: boolean;
  label: string;
  onUploaded: (files: { url: string; kind: "image" | "video"; name: string }[]) => void;
}) {
  const [progress, setProgress] = useState<string | null>(null);

  async function handle(input: HTMLInputElement) {
    const files = [...(input.files ?? [])];
    if (!files.length) return;
    const done: { url: string; kind: "image" | "video"; name: string }[] = [];
    try {
      for (const [index, file] of files.entries()) {
        const result = await uploadMedia(file, (p) =>
          setProgress(files.length > 1 ? `${index + 1}/${files.length} · ${Math.round(p)}%` : `${Math.round(p)}%`),
        );
        done.push({ ...result, name: file.name });
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Falha no envio");
    } finally {
      setProgress(null);
      input.value = "";
      if (done.length) onUploaded(done);
    }
  }

  return (
    <label className={styles.ghost} aria-busy={Boolean(progress)}>
      {progress ? `Enviando ${progress}` : label}
      <input type="file" accept={accept} multiple={multiple} hidden disabled={Boolean(progress)} onChange={(e) => handle(e.currentTarget)} />
    </label>
  );
}

function MediaField({
  label,
  value,
  accept,
  onChange,
}: {
  label: string;
  value: string;
  accept: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={styles.field}>
      <span>{label}</span>
      <div className={styles.media}>
        <Preview src={value} />
        <div className={styles.mediaControls}>
          <input value={value} placeholder="Link do arquivo" onChange={(e) => onChange(e.target.value)} />
          <span className={styles.inline}>
            <UploadButton accept={accept} label="Enviar do computador" onUploaded={([file]) => onChange(file.url)} />
            {value ? (
              <button type="button" className={styles.ghost} onClick={() => onChange("")}>
                Limpar
              </button>
            ) : null}
          </span>
        </div>
      </div>
    </div>
  );
}

function PhotosField({ photos, onChange }: { photos: Photo[]; onChange: (photos: Photo[]) => void }) {
  return (
    <fieldset className={styles.fieldset}>
      <legend>Fotos ({photos.length})</legend>
      <ul role="list" className={styles.photos}>
        {photos.map((photo, index) => (
          <li key={`${photo.src}-${index}`} className={styles.photo} data-hidden={photo.hidden || undefined}>
            <Preview src={photo.src} />
            <input
              placeholder="Descrição da foto"
              value={photo.alt}
              onChange={(e) => onChange(photos.map((p, i) => (i === index ? { ...p, alt: e.target.value } : p)))}
            />
            <span className={styles.inline}>
              <button type="button" className={styles.ghost} onClick={() => onChange(move(photos, index, -1))} aria-label="Antes">
                ←
              </button>
              <button type="button" className={styles.ghost} onClick={() => onChange(move(photos, index, 1))} aria-label="Depois">
                →
              </button>
              <button
                type="button"
                className={styles.ghost}
                aria-pressed={Boolean(photo.hidden)}
                onClick={() => onChange(photos.map((p, i) => (i === index ? { ...p, hidden: !p.hidden } : p)))}
              >
                {photo.hidden ? "Mostrar" : "Ocultar"}
              </button>
              <button type="button" className={styles.danger} onClick={() => onChange(photos.filter((_, i) => i !== index))}>
                ×
              </button>
            </span>
          </li>
        ))}
      </ul>
      <UploadButton
        accept="image/*"
        multiple
        label="+ Enviar fotos"
        onUploaded={(files) => onChange([...photos, ...files.map((f) => ({ src: f.url, alt: "" }))])}
      />
    </fieldset>
  );
}

function LinksField({
  label,
  links,
  uploadAccept,
  onChange,
}: {
  label: string;
  links: string[];
  uploadAccept?: string;
  onChange: (links: string[]) => void;
}) {
  return (
    <fieldset className={styles.fieldset}>
      <legend>{label}</legend>
      {links.map((link, index) => (
        <div key={index} className={styles.inline}>
          <input value={link} placeholder="https://…" onChange={(e) => onChange(links.map((l, i) => (i === index ? e.target.value : l)))} />
          <button type="button" className={styles.ghost} onClick={() => onChange(move(links, index, -1))} aria-label="Subir">
            ↑
          </button>
          <button type="button" className={styles.danger} onClick={() => onChange(links.filter((_, i) => i !== index))}>
            ×
          </button>
        </div>
      ))}
      <span className={styles.inline}>
        <button type="button" className={styles.ghost} onClick={() => onChange([...links, ""])}>
          + Link
        </button>
        {uploadAccept ? (
          <UploadButton
            accept={uploadAccept}
            multiple
            label="+ Enviar vídeo do computador"
            onUploaded={(files) => onChange([...links, ...files.map((f) => f.url)])}
          />
        ) : null}
      </span>
    </fieldset>
  );
}
