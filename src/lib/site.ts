/**
 * Dados fixos do site. Tudo o que muda com frequência (projetos) vem do
 * Notion; os textos traduzidos (bio, cidade, chamadas) ficam em i18n.ts.
 */

export const site = {
  name: "VJ Olho Negro",
  wordmark: ["OLHO", "NEGRO"],
  person: "Lucas Guimarães",

  contact: {
    email: "olhonegrostore@gmail.com",
    phoneDisplay: "+55 61 98299-9869",
    whatsapp: "https://wa.me/5561982999869",
    instagram: { handle: "@vjolhonegro", url: "https://instagram.com/vjolhonegro" },
    /** Outros canais (Vimeo, YouTube, LinkedIn…). Deixe vazio o que não usar. */
    others: [] as { label: string; url: string }[],
  },

  /** Artistas, palcos e marcas que aparecem na Home e no Sobre. */
  credits: [
    "Rock in Rio",
    "Budah",
    "Duquesa",
    "Jenni Mosello",
    "BudX na Copa do Mundo",
    "Sesc",
    "Coolritiba",
    "Museu da Língua Portuguesa",
  ],

  /**
   * Categorias do Notion que não aparecem no portfólio público.
   * Remova um item desta lista para voltar a mostrá-lo.
   */
  hiddenCategories: ["Desenvolvimento", "Educação"],

  /** Quantos projetos aparecem em destaque na Home. */
  featuredCount: 5,
} as const;

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
