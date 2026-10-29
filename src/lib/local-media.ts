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
};

function photos(slug: string, alts: string[]) {
  return alts.map((alt, index) => ({
    src: `/projetos/${slug}/${String(index + 1).padStart(2, "0")}.jpg`,
    alt,
  }));
}

export const localMedia: Record<string, LocalMedia> = {
  "emopalooza-de-halloween": {
    photos: photos("emopalooza-de-halloween", [
      "Palco do Emopalooza com os visuais projetados na estrutura cenográfica",
      "Pista do Emopalooza com luz verde e cenografia de Halloween",
      "Cenografia de Halloween ao lado do palco",
      "Arte de divulgação do Emopalooza de Halloween",
    ]),
    instagram: [],
  },
  "festival-halloweeknd": {
    photos: photos("festival-halloweeknd", [
      "Palco do Festival Halloweeknd com fogos e visuais no telão",
      "Line-up do Festival Halloweeknd",
    ]),
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
    ]),
    instagram: ["https://www.instagram.com/p/C0l-fZTsfvA/"],
  },
  budx: {
    photos: photos("budx", ["Entrada do BudX em Brasília com a taça da Copa"]),
    instagram: [],
  },
};

export function getLocalMedia(slug: string): LocalMedia {
  return localMedia[slug] ?? { photos: [], instagram: [] };
}
