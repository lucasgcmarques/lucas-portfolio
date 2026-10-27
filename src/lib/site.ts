/**
 * Textos e dados fixos do site. Tudo o que muda com frequência (projetos)
 * vem do Notion; o que está aqui muda raramente.
 */

export const site = {
  name: "VJ Olho Negro",
  wordmark: ["OLHO", "NEGRO"],
  person: "Lucas Guimarães",
  role: "VJ e artista visual",
  city: "Brasília, Brasil",
  description:
    "Lucas Guimarães (VJ Olho Negro) cria visuais ao vivo, video mapping, 3D e motion para shows, festivais, teatro e marcas.",
  intro:
    "Visuais ao vivo, video mapping, 3D e motion para shows, festivais, teatro e marcas. Baseado em Brasília, trabalhando no Brasil e fora dele.",

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
    "Ludmilla",
    "Marcelo D2",
    "Luedji Luna",
    "Pedro Sampaio",
    "Jenni Mosello",
    "BudX na Copa do Mundo",
    "Sesc",
    "Coolritiba",
    "Museu da Língua Portuguesa",
  ],

  bio: [
    "Sou Lucas Guimarães, VJ e artista visual de Brasília. Comecei em computação gráfica e 3D em 2014 e, desde então, fui levando isso para a pista, o palco e o espaço: visuais ao vivo, video mapping, cenografia digital e instalações que reagem ao público.",
    "Trabalho tanto na operação ao vivo, sincronizando imagem e música em tempo real, quanto em estúdio, produzindo conteúdo pré-renderizado para telas de LED de turnês e festivais.",
  ],

  education: [
    { title: "Análise e Desenvolvimento de Sistemas", place: "UDF Brasília", period: "2022–2024" },
    { title: "Computação Gráfica", place: "IESB", period: "2015–2016" },
  ],

  tools: [
    "TouchDesigner",
    "Blender",
    "Cinema 4D",
    "3ds Max",
    "After Effects",
    "Premiere",
    "Photoshop",
    "Illustrator",
  ],

  skills: [
    "Video mapping e projeção",
    "Visuais em tempo real e sistemas interativos",
    "Motion graphics e animação",
    "Modelagem e render 3D",
    "Cenografia digital e instalações",
    "Sincronização com performance ao vivo",
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
