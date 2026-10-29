import { cache } from "react";
import { getLocalMedia } from "./local-media";
import { isVideoFileName, parseVideo, vimeoThumbnail } from "./media";
import { mapWithConcurrency, notionConfigured, notionRequest } from "./notion/client";
import {
  PROPS,
  getCheckbox,
  getDate,
  getFiles,
  getMultiSelect,
  getSelect,
  getText,
  getTitle,
  getUrl,
  hasProperty,
} from "./notion/properties";
import type {
  BlockChildrenResponse,
  BlockData,
  NotionBlock,
  NotionFile,
  NotionPage,
  QueryResponse,
} from "./notion/types";
import { sampleBlocks, sampleProjects } from "./sample-data";
import { site } from "./site";
import { uniqueSlugs } from "./slug";

export type Media = {
  kind: "image" | "video";
  src: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string | null;
  tags: string[];
  /** Data de início em ISO (AAAA-MM-DD). */
  date: string | null;
  endDate: string | null;
  year: number | null;
  location: string | null;
  featured: boolean;
  /** Capa definida no Notion (coluna Capa ou capa da página). */
  cover: Media | null;
  /** Imagem usada na grade: a capa ou a primeira mídia do conteúdo. */
  thumbnail: Media | null;
  videoUrl: string | null;
  /** Fotos guardadas no site (public/projetos). */
  photos: { src: string; alt: string }[];
  /** Links de posts/reels do Instagram escolhidos para o projeto. */
  instagram: string[];
};

/* ---------- URLs de mídia ---------- */

/**
 * Arquivos enviados ao Notion têm links temporários (expiram em 1 hora).
 * Por isso o site aponta para /api/media, que busca um link novo a cada acesso.
 */
export function proxiedMediaUrl(
  id: string,
  source: "block" | "cover" | "property",
  property?: string,
  index = 0,
): string {
  const params = new URLSearchParams({ src: source });
  if (property) params.set("prop", property);
  if (index) params.set("i", String(index));
  return `/api/media/${id}?${params.toString()}`;
}

function fileToMedia(file: NotionFile, proxied: string): Media {
  if (file.type === "external") {
    return { kind: isVideoFileName(file.external.url) ? "video" : "image", src: file.external.url };
  }
  const name = file.name ?? new URL(file.file.url).pathname;
  return { kind: isVideoFileName(name) ? "video" : "image", src: proxied };
}

/* ---------- Mapeamento página → projeto ---------- */

/** Coluna Instagram: aceita tipo URL ou texto, com um ou mais links. */
function getInstagramLinks(properties: NotionPage["properties"]): string[] {
  const raw = [getUrl(properties, PROPS.instagram), getText(properties, PROPS.instagram)].filter(Boolean).join(" ");
  return raw.split(/[\s,]+/).filter((link) => parseVideo(link)?.provider === "instagram");
}

function pageToProject(
  page: NotionPage,
): Omit<Project, "slug" | "thumbnail" | "photos"> & { slugOverride: string } {
  const p = page.properties;
  const date = getDate(p, PROPS.date);
  const coverFiles = getFiles(p, PROPS.cover);

  let cover: Media | null = null;
  if (coverFiles.length > 0) {
    cover = fileToMedia(coverFiles[0], proxiedMediaUrl(page.id, "property", PROPS.cover));
  } else if (page.cover) {
    cover = fileToMedia(page.cover, proxiedMediaUrl(page.id, "cover"));
  }

  return {
    id: page.id,
    slugOverride: getText(p, PROPS.slug),
    title: getTitle(p, PROPS.title) || "Sem título",
    description: getText(p, PROPS.description),
    category: getSelect(p, PROPS.category),
    tags: getMultiSelect(p, PROPS.tags),
    date: date?.start.slice(0, 10) ?? null,
    endDate: date?.end?.slice(0, 10) ?? null,
    year: date ? Number(date.start.slice(0, 4)) : null,
    location: getText(p, PROPS.location) || null,
    featured: getCheckbox(p, PROPS.featured),
    cover,
    videoUrl: getUrl(p, PROPS.video),
    instagram: getInstagramLinks(p),
  };
}

/** Primeira imagem ou vídeo do conteúdo de um projeto, para usar como miniatura. */
async function thumbnailFromBlocks(blocks: NotionBlock[]): Promise<Media | null> {
  for (const block of flattenBlocks(blocks)) {
    const data = block[block.type] as BlockData | undefined;
    if (!data) continue;

    if (block.type === "image") {
      const src = data.type === "external" ? data.external?.url : proxiedMediaUrl(block.id, "block");
      if (src) return { kind: "image", src };
    }

    if (block.type === "video" || block.type === "embed") {
      if (data.type === "file") return { kind: "video", src: proxiedMediaUrl(block.id, "block") };
      const url = data.type === "external" ? data.external?.url : data.url;
      const thumb = await thumbnailFromVideoUrl(url);
      if (thumb) return thumb;
    }
  }
  return null;
}

async function thumbnailFromVideoUrl(url: string | null | undefined): Promise<Media | null> {
  const video = parseVideo(url);
  if (!video) return null;
  if (video.provider === "youtube" || video.provider === "drive") return { kind: "image", src: video.thumbnail };
  if (video.provider === "file") return { kind: "video", src: video.src };
  if (video.provider === "instagram") return null;
  const thumb = await vimeoThumbnail(video.pageUrl);
  return thumb ? { kind: "image", src: thumb } : null;
}

function flattenBlocks(blocks: NotionBlock[]): NotionBlock[] {
  return blocks.flatMap((block) => [block, ...flattenBlocks(block.children ?? [])]);
}

/* ---------- Busca no Notion ---------- */

async function queryAllPages(): Promise<NotionPage[]> {
  const databaseId = process.env.NOTION_DATABASE_ID as string;
  const pages: NotionPage[] = [];
  let cursor: string | null = null;
  do {
    const response: QueryResponse = await notionRequest<QueryResponse>(`/databases/${databaseId}/query`, {
      method: "POST",
      body: {
        page_size: 100,
        sorts: [{ property: PROPS.date, direction: "descending" }],
        ...(cursor ? { start_cursor: cursor } : {}),
      },
    });
    pages.push(...response.results);
    cursor = response.has_more ? response.next_cursor : null;
  } while (cursor);
  return pages;
}

/** Tipos de bloco cujos filhos não fazem parte do conteúdo da página. */
const SKIP_CHILDREN = new Set(["child_page", "child_database", "link_to_page"]);

async function fetchBlockTree(blockId: string, depth = 0): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | null = null;
  do {
    const query: string = cursor ? `?page_size=100&start_cursor=${cursor}` : "?page_size=100";
    const response: BlockChildrenResponse = await notionRequest<BlockChildrenResponse>(
      `/blocks/${blockId}/children${query}`,
    );
    blocks.push(...response.results);
    cursor = response.has_more ? response.next_cursor : null;
  } while (cursor);

  if (depth < 3) {
    await mapWithConcurrency(blocks, 2, async (block) => {
      if (block.has_children && !SKIP_CHILDREN.has(block.type)) {
        block.children = await fetchBlockTree(block.id, depth + 1);
      }
    });
  }
  return blocks;
}

/* ---------- API usada pelas páginas ---------- */

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!notionConfigured()) return sampleProjects;

  const pages = await queryAllPages();
  const hidden = new Set<string>(site.hiddenCategories);

  const visible = pages
    .filter((page) => !hasProperty(page.properties, PROPS.published) || getCheckbox(page.properties, PROPS.published))
    .map(pageToProject)
    .filter((project) => !project.category || !hidden.has(project.category));

  const slugs = uniqueSlugs(visible.map((p) => ({ id: p.id, title: p.title, override: p.slugOverride })));

  return mapWithConcurrency(visible, 3, async ({ slugOverride: _slugOverride, ...notionProject }) => {
    const slug = slugs.get(notionProject.id) as string;
    const local = getLocalMedia(slug);
    const project = {
      ...notionProject,
      photos: local.photos,
      instagram: [...new Set([...notionProject.instagram, ...local.instagram])],
    };
    const localCover: Media | null = local.photos[0] ? { kind: "image", src: local.photos[0].src } : null;
    let thumbnail = project.cover?.kind === "image" ? project.cover : localCover;
    if (!thumbnail) thumbnail = await thumbnailFromVideoUrl(project.videoUrl);
    if (!thumbnail) thumbnail = await thumbnailFromBlocks(await getBlocks(project.id));
    if (!thumbnail && project.cover) thumbnail = project.cover;
    return { ...project, slug, thumbnail };
  });
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
});

/** Blocos (conteúdo) de uma página do Notion, com filhos aninhados. */
export const getBlocks = cache(async (pageId: string): Promise<NotionBlock[]> => {
  if (!notionConfigured()) return sampleBlocks(pageId);
  return fetchBlockTree(pageId);
});

/** Projetos em destaque na Home: os marcados como Destaque ou, sem isso, os mais recentes com imagem. */
export function pickFeatured(projects: Project[], count: number = site.featuredCount): Project[] {
  const marked = projects.filter((project) => project.featured);
  if (marked.length > 0) return marked.slice(0, count);
  const withMedia = projects.filter((project) => project.thumbnail);
  const rest = projects.filter((project) => !project.thumbnail);
  return [...withMedia, ...rest].slice(0, count);
}

/** Vídeo ou imagem que aparece por dentro das letras na Home. */
export function pickHeroMedia(projects: Project[]): Media | null {
  const fromEnv = process.env.HERO_VIDEO_URL;
  if (fromEnv) return { kind: "video", src: fromEnv };
  const ordered = [...projects.filter((p) => p.featured), ...projects];
  const video = ordered.find((p) => p.cover?.kind === "video")?.cover;
  if (video) return video;
  return ordered.find((p) => p.thumbnail?.kind === "image")?.thumbnail ?? null;
}
