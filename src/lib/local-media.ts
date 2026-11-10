/**
 * Fotos guardadas no próprio site (pasta public/projetos/<endereço-do-projeto>/)
 * e posts do Instagram escolhidos para cada projeto.
 *
 * A chave é o endereço do projeto (o final da URL /portfolio/...).
 * A primeira foto vira a capa, a não ser que o projeto já tenha Capa no Notion.
 * Posts do Instagram também podem ser colocados na coluna "Instagram" do Notion
 * (um ou mais links separados por espaço ou vírgula); os dois se somam.
 */

export type LocalMedia = {
  photos: { src: string; alt: string }[];
  instagram: string[];
  /** Vídeos extras (YouTube, Vimeo...). No YouTube, "&t=62" começa em 1:02. */
  videos?: string[];
};

function photos(slug: string, alts: string[]) {
  return alts.map((alt, index) => ({
    src: `/projetos/${slug}/${String(index + 1).padStart(2, "0")}.jpg`,
    alt,
  }));
}

// Fotos vindas do álbum do iCloud (public/projetos/<slug>/album-NN.jpg).
function album(slug: string, alts: string[]) {
  return alts.map((alt, index) => ({
    src: `/projetos/${slug}/album-${String(index + 1).padStart(2, "0")}.jpg`,
    alt,
  }));
}

const coachella: LocalMedia = {
  photos: photos("visuais-luisa-sonza-coachella", [
    "Luísa Sonza com dançarinos e bandeira do Brasil no palco do Coachella 2026",
    "Luísa Sonza cantando no palco Gobi do Coachella 2026",
    "Luísa Sonza e dançarinas sob a luz do palco no Coachella 2026",
  ]),
  instagram: [],
};

export const localMedia: Record<string, LocalMedia> = {
  "emopalooza-de-halloween": {
    photos: photos("emopalooza-de-halloween", [
      "Palco do Emopalooza com os visuais projetados na estrutura cenográfica",
      "Pista do Emopalooza com luz verde e cenografia de Halloween",
      "Cenografia de Halloween ao lado do palco",
      "Arte de divulgação do Emopalooza de Halloween",
    ]).concat(
      album("emopalooza-de-halloween", [
        "Cenografia do Emopalooza com o letreiro EMO e os visuais nas telas laterais",
      ]),
    ),
    instagram: [],
  },
  "festival-halloweeknd": {
    photos: photos("festival-halloweeknd", [
      "Palco do Festival Halloweeknd com fogos e visuais no telão",
      "Line-up do Festival Halloweeknd",
    ]).concat(
      album("festival-halloweeknd", [
        "Palco do Halloweeknd com o logo do festival no telão e luzes vermelhas e azuis",
        "Telão do Halloweeknd com a arte do festival sobre fundo vermelho e verde",
        "Visual verde e roxo no telão do Halloweeknd durante o show",
      ]),
    ),
    instagram: [],
  },
  "1-festival-fyah-cultura-black": {
    photos: photos("1-festival-fyah-cultura-black", ["Arte de divulgação do 1º Festival Fyah"]),
    instagram: [],
  },
  "festival-beco-eletrico-edicao-de-6-anos": {
    photos: photos("festival-beco-eletrico-edicao-de-6-anos", [
      "Público e luzes no Festival Beco Elétrico",
      "Arte de divulgação do Festival Beco Elétrico, 6 anos",
    ]),
    instagram: [],
  },
  "vj-torna-2018": {
    photos: photos("vj-torna-2018", [
      "Projeção nas telas do VJ Torna para o público na Praça dos Três Poderes",
      "Tela do VJ Torna 2018 à noite",
      "Visual projetado durante a competição",
      "VJ operando diante da projeção",
      "Mesa de debate do VJ Torna",
      "VJs participantes do VJ Torna 2018",
      "VJs participantes do VJ Torna 2018",
      "Matéria de jornal sobre os VJs de Brasília",
      "Cartaz do VJ Torna Brasil 2018",
    ]),
    instagram: [],
  },
  "tropical-jazz": {
    photos: photos("tropical-jazz", [
      "Show no palco do Tropical Jazz com visuais ao fundo",
      "Violinista no palco do Tropical Jazz",
      "Show do Tropical Jazz em preto e branco",
      "Arte de divulgação do Tropical Jazz",
    ]).concat(
      album("tropical-jazz", [
        "Público dançando sob a tenda do Tropical Jazz com luzes coloridas",
        "Feixes de luz amarela sobre o público do Tropical Jazz",
        "Show à noite no palco do Tropical Jazz, visto do meio do público",
        "Palco do Tropical Jazz de dia com a arte tropical no telão de LED",
        "Telão de LED do Tropical Jazz com a arte do festival antes do show",
      ]),
    ),
    instagram: ["https://www.instagram.com/p/C0l-fZTsfvA/"],
  },
  budx: {
    photos: photos("budx", ["Entrada do BudX em Brasília com a taça da Copa"]),
    instagram: [],
  },
  "prazer-zeze-o-musical": {
    photos: photos("prazer-zeze-o-musical", [
      "Dueto no palco de Prazer, Zezé! com o telão de LED ao fundo",
      "Atriz de Prazer, Zezé! em foto de divulgação",
    ]),
    instagram: [],
  },
  "centro-cultural-sesc-df": {
    photos: photos("centro-cultural-sesc-df", [
      "Projeção mapeada em amarelo e roxo na fachada do Centro Cultural Sesc",
      "Fachada do Centro Cultural Sesc com projeção e feixes de laser no céu",
    ]),
    instagram: [],
  },
  "festival-do-clube-de-criacao-2026-show-da-jenni-mosello": {
    photos: photos("festival-do-clube-de-criacao-2026-show-da-jenni-mosello", [
      "Lettering da Jenni Mosello usado nos visuais do show",
    ]).concat(
      album("festival-do-clube-de-criacao-2026-show-da-jenni-mosello", [
        "Lucas na lateral do palco do Festival do Clube de Criação, ao lado do telão de LED",
        "Notebook e controlador usados para mixar os visuais do show da Jenni Mosello",
      ]),
    ),
    instagram: [],
  },
  "visuais-luisa-sonza-coachella": coachella,
  // Endereço antigo do mesmo projeto (antes do título mudar no Notion).
  "coachella-luisa-sonza": coachella,
  "turne-brutal-paraiso-luisa-sonza": {
    photos: photos("turne-brutal-paraiso-luisa-sonza", [
      "Luísa Sonza no palco do Rock in Rio com a turnê Brutal Paraíso",
    ]),
    instagram: [],
  },
  "coloquio-internacional-oyapock": {
    photos: photos("coloquio-internacional-oyapock", [
      "Maluwana, Céu de Casa: floresta projetada em 360° na cúpula do Museu da Língua Portuguesa",
      "Maluwana, Céu de Casa: projeção imersiva em rosa e azul sobre o público",
    ]),
    instagram: [],
  },
  "ativacao-superbet-rock-in-rio-2026": {
    photos: [
      {
        src: "/projetos/ativacao-superbet-rock-in-rio-2026/cubo.jpg",
        alt: "Cubo de LED da Superbet com rostos em malha de pontos vermelhos, no Rock in Rio 2026",
      },
      ...photos("ativacao-superbet-rock-in-rio-2026", [
        "Arena Super da Superbet iluminada à noite na Cidade do Rock",
        "Perspectiva 3D da Arena Super no Rock in Rio 2026",
      ]),
    ],
    instagram: [],
    videos: [
      "https://www.youtube.com/watch?v=D6h-T2sJNdw",
      // O trecho da ativação começa em 1:02.
      "https://www.youtube.com/watch?v=9hchs337iPc&t=62",
    ],
  },
  "frequencia-lunar-budah": {
    photos: photos("frequencia-lunar-budah", ["Budah em foto de divulgação do álbum Frequência Lunar"]),
    instagram: [],
  },
  "mad-in-brazza-festival-2026": {
    photos: photos("mad-in-brazza-festival-2026", [
      "Divulgação do MAD IN BRAZZA 2026 em Curitiba, com Ty Dolla $ign como atração principal",
    ]),
    instagram: [],
  },
  "festival-movimento-cidade-2026-show-da-budah": {
    photos: photos("festival-movimento-cidade-2026-show-da-budah", [
      "Arte de divulgação do Budah Convida com Duquesa no Movimento Cidade",
      "Palco e público do Festival Movimento Cidade 2026 na Prainha, em Vila Velha",
    ]),
    instagram: [],
  },
  "desfile-verdurao-interfashion-brasilia-2025": {
    photos: photos("desfile-verdurao-interfashion-brasilia-2025", [
      "Passarela do INTERFASHION Brasília 2025 com o público e o telão ao fundo",
    ]),
    instagram: [],
  },
};

export function getLocalMedia(slug: string): LocalMedia {
  return localMedia[slug] ?? { photos: [], instagram: [] };
}
