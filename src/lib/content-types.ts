/**
 * Formato do conteúdo editável pelo CMS (/admin). Tudo fica num único JSON
 * guardado no Vercel Blob; cada salvamento grava uma versão nova.
 *
 * Os textos fixos da interface (menu, botões, traduções) continuam em
 * i18n.ts. Aqui fica só o que muda: projetos, Art, Sobre, Contato e mídias.
 */

import type { ArtCategory } from "./art";

export type Photo = {
  src: string;
  alt: string;
  /** Fica guardada no CMS, mas não aparece no site. */
  hidden?: boolean;
};

export type ProjectEntry = {
  id: string;
  /** Final da URL (/portfolio/<slug>). Vazio = gerado a partir do título. */
  slug: string;
  title: string;
  /** Resumo curto que aparece abaixo do título. */
  description: string;
  /** Texto longo da página do projeto. Parágrafos separados por linha em branco. */
  body: string;
  category: string;
  tags: string[];
  /** AAAA-MM-DD */
  date: string;
  endDate: string;
  location: string;
  featured: boolean;
  published: boolean;
  /** Imagem ou vídeo de capa. Vazio = primeira foto. */
  cover: string;
  photos: Photo[];
  /** Links do YouTube/Vimeo ou vídeos enviados. No YouTube, "&t=62" começa em 1:02. */
  videos: string[];
  instagram: string[];
};

export type ArtEntry = {
  id: string;
  src: string;
  kind: "image" | "video";
  category: ArtCategory;
  alt: string;
  title: string;
  size: "small" | "wide" | "tall" | "large";
  /** Quadro do vídeo mostrado enquanto ele carrega. */
  poster?: string;
  /** Fica guardado no CMS, mas não aparece no site. */
  hidden?: boolean;
};

export type Localized = { pt: string; en: string; fr: string };

export type AboutContent = {
  /** Bio por idioma. Parágrafos separados por linha em branco; vazio = texto padrão. */
  bio: Localized;
  art: string;
  artAlt: string;
  /** Palcos e artistas (Home). */
  credits: string[];
};

export type ContactContent = {
  email: string;
  phoneDisplay: string;
  whatsapp: string;
  instagramHandle: string;
  instagramUrl: string;
  others: { label: string; url: string }[];
};

export type SiteContent = {
  version: 1;
  updatedAt: string;
  /** Vídeo que passa por dentro das letras OLHO NEGRO. */
  heroVideo: string;
  projects: ProjectEntry[];
  art: ArtEntry[];
  about: AboutContent;
  contact: ContactContent;
};

export function isVideoUrl(src: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(src);
}

export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}
