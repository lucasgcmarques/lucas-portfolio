/** "Turnê "Brutal Paraíso" — Luísa Sonza" → "turne-brutal-paraiso-luisa-sonza" */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/** Gera um endereço único por projeto. Em caso de nomes repetidos, acrescenta parte do ID. */
export function uniqueSlugs(items: { id: string; title: string; override?: string }[]): Map<string, string> {
  const result = new Map<string, string>();
  const used = new Set<string>();
  for (const item of items) {
    let slug = slugify(item.override || item.title) || item.id.replace(/-/g, "").slice(0, 8);
    if (used.has(slug)) slug = `${slug}-${item.id.replace(/-/g, "").slice(0, 6)}`;
    used.add(slug);
    result.set(item.id, slug);
  }
  return result;
}
