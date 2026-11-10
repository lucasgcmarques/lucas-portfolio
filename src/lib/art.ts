/**
 * Trabalhos da página Art. Cada um é uma imagem ou um vídeo guardado no
 * próprio site (public/). A ordem da lista é a ordem do mosaico.
 *
 * `size` define o bloco: "large" (2×2), "wide" (2×1), "tall" (1×2) ou
 * "small" (1×1, o padrão). Misturar tamanhos é o que dá o ritmo do mosaico.
 */

export const artCategories = ["Projection Photography", "Video Art", "Digital Art", "Music"] as const;
export type ArtCategory = (typeof artCategories)[number];

export type ArtWork = {
  src: string;
  kind: "image" | "video";
  category: ArtCategory;
  alt: string;
  title?: string;
  size?: "small" | "wide" | "tall" | "large";
};

export const artWorks: ArtWork[] = [
  {
    src: "/projetos/centro-cultural-sesc-df/02.jpg",
    kind: "image",
    category: "Projection Photography",
    alt: "Fachada do Centro Cultural Sesc com projeção e feixes de laser no céu",
    title: "Centro Cultural Sesc DF",
    size: "large",
  },
  {
    src: "/videos/teste-psicodelico.mp4",
    kind: "video",
    category: "Video Art",
    alt: "Formas psicodélicas em movimento",
    size: "tall",
  },
  {
    src: "/images/organismo.png",
    kind: "image",
    category: "Digital Art",
    alt: "Organismo verde translúcido em 3D com tubos cromados e tipografia pixelada",
    title: "Organismo",
  },
  {
    src: "/projetos/coloquio-internacional-oyapock/01.jpg",
    kind: "image",
    category: "Projection Photography",
    alt: "Maluwana, Céu de Casa: floresta projetada em 360° na cúpula do Museu da Língua Portuguesa",
    title: "Maluwana, Céu de Casa",
  },
  {
    src: "/videos/teste-palco-dither.mp4",
    kind: "video",
    category: "Video Art",
    alt: "Palco em dither, em movimento",
    size: "wide",
  },
  {
    src: "/projetos/vj-torna-2018/01.jpg",
    kind: "image",
    category: "Projection Photography",
    alt: "Projeção nas telas do VJ Torna para o público na Praça dos Três Poderes",
    title: "VJ Torna 2018",
  },
  {
    src: "/images/tipografia-pixel-recorte.png",
    kind: "image",
    category: "Digital Art",
    alt: "Tipografia pixelada com textura cromada formando as palavras visual, techno e artista",
    size: "wide",
  },
  {
    src: "/projetos/coloquio-internacional-oyapock/02.jpg",
    kind: "image",
    category: "Projection Photography",
    alt: "Maluwana, Céu de Casa: projeção imersiva em rosa e azul sobre o público",
    size: "tall",
  },
  {
    src: "/projetos/centro-cultural-sesc-df/01.jpg",
    kind: "image",
    category: "Projection Photography",
    alt: "Projeção mapeada em amarelo e roxo na fachada do Centro Cultural Sesc",
  },
  {
    src: "/videos/hero-dither-vermelho.mp4",
    kind: "video",
    category: "Video Art",
    alt: "Show em dither vermelho, em movimento",
    size: "large",
  },
  {
    src: "/projetos/vj-torna-2018/03.jpg",
    kind: "image",
    category: "Projection Photography",
    alt: "Visual projetado durante a competição VJ Torna",
  },
  {
    src: "/projetos/emopalooza-de-halloween/01.jpg",
    kind: "image",
    category: "Projection Photography",
    alt: "Palco do Emopalooza com os visuais projetados na estrutura cenográfica",
    size: "wide",
  },
  {
    src: "/projetos/vj-torna-2018/02.jpg",
    kind: "image",
    category: "Projection Photography",
    alt: "Tela do VJ Torna 2018 à noite",
  },
  {
    src: "/projetos/prazer-zeze-o-musical/01.jpg",
    kind: "image",
    category: "Projection Photography",
    alt: "Dueto no palco de Prazer, Zezé! com o telão de LED ao fundo",
    title: "Prazer, Zezé!",
    size: "tall",
  },
];
