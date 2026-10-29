import type { NotionFile, Property, RichText } from "./types";

/**
 * Nomes das colunas do database "VJ Projects" no Notion.
 * As que estão marcadas como opcionais podem não existir: o site funciona sem elas.
 */
export const PROPS = {
  title: "Name",
  description: "Descrição",
  category: "Categoria",
  date: "Data",
  location: "Local",
  /** Opcional (multi-select): tags extras, ex. 3D, Motion, TouchDesigner. */
  tags: "Tags",
  /** Opcional (arquivos): imagem ou vídeo de capa do projeto. */
  cover: "Capa",
  /** Opcional (checkbox): aparece na Home. */
  featured: "Destaque",
  /** Opcional (checkbox): se a coluna existir, só projetos marcados aparecem no site. */
  published: "Publicado",
  /** Opcional (texto): endereço personalizado, ex. "rock-in-rio-2026". */
  slug: "Slug",
  /** Opcional (URL): link de vídeo principal (YouTube, Vimeo, Drive ou .mp4). */
  video: "Vídeo",
  /** Opcional (URL ou texto): um ou mais links de posts/reels do Instagram. */
  instagram: "Instagram",
} as const;

export function plainText(rich: RichText[] | undefined): string {
  return (rich ?? []).map((part) => part.plain_text).join("").trim();
}

function prop(properties: Record<string, Property>, name: string, type: string): Property | null {
  const value = properties[name];
  return value && value.type === type ? value : null;
}

export function hasProperty(properties: Record<string, Property>, name: string): boolean {
  return name in properties;
}

export function getTitle(properties: Record<string, Property>, name: string): string {
  const value = prop(properties, name, "title");
  return value ? plainText(value.title as RichText[]) : "";
}

export function getText(properties: Record<string, Property>, name: string): string {
  const value = prop(properties, name, "rich_text");
  return value ? plainText(value.rich_text as RichText[]) : "";
}

export function getSelect(properties: Record<string, Property>, name: string): string | null {
  const value = prop(properties, name, "select");
  const select = value?.select as { name: string } | null | undefined;
  return select?.name ?? null;
}

export function getMultiSelect(properties: Record<string, Property>, name: string): string[] {
  const value = prop(properties, name, "multi_select");
  const options = (value?.multi_select as { name: string }[] | undefined) ?? [];
  return options.map((option) => option.name);
}

export function getDate(properties: Record<string, Property>, name: string): { start: string; end: string | null } | null {
  const value = prop(properties, name, "date");
  const date = value?.date as { start: string; end: string | null } | null | undefined;
  return date?.start ? { start: date.start, end: date.end } : null;
}

export function getCheckbox(properties: Record<string, Property>, name: string): boolean {
  const value = prop(properties, name, "checkbox");
  return value?.checkbox === true;
}

export function getUrl(properties: Record<string, Property>, name: string): string | null {
  const value = prop(properties, name, "url");
  return typeof value?.url === "string" && value.url ? value.url : null;
}

export function getFiles(properties: Record<string, Property>, name: string): NotionFile[] {
  const value = prop(properties, name, "files");
  return (value?.files as NotionFile[] | undefined) ?? [];
}
