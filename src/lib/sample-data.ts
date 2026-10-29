import type { NotionBlock, RichText } from "./notion/types";
import type { Project } from "./projects";
import { getLocalMedia } from "./local-media";
import { slugify } from "./slug";

/**
 * Conteúdo de exemplo, copiado do database "VJ Projects".
 * Só é usado quando NOTION_TOKEN não está configurado (desenvolvimento local
 * ou um deploy sem as variáveis de ambiente).
 */

type Row = [title: string, category: string, date: string, location: string, description: string];

const rows: Row[] = [
  ["Festival do Clube de Criação 2026 — show da Jenni Mosello", "VJ", "2026-10-17", "Memorial da América Latina, São Paulo", "Mixei os visuais ao vivo do show da Jenni Mosello no palco musical do festival."],
  ["Ativação SuperBet — Rock in Rio 2026", "Instalação Artística", "2026-09-04", "Arena Super, Cidade do Rock (Parque Olímpico), Rio de Janeiro", "Desenvolvi uma instalação interativa com TouchDesigner que reage ao público, além de mixar VJ ao vivo na ativação ao longo dos sete dias do festival."],
  ["Frequência Lunar — Budah", "Produção de Conteúdo", "2026-08-22", "Estreia no Cine Joia, São Paulo; segue por Brasília, Maceió e Natal", "Produzi o conteúdo visual e a identidade visual da turnê em estúdio, entregando o material para ser operado ao vivo em cada apresentação."],
  ["Festival Movimento Cidade 2026 — show da Budah", "VJ", "2026-08-15", "Parque da Prainha, Vila Velha, ES", "Operei os visuais ao vivo do show da Budah (projeto \"Budah Convida\") no Festival Movimento Cidade."],
  ["Virada Cultural Sesc DF", "Instalação Artística", "2026-08-15", "Setor Comercial Sul (SCS), Brasília", "Criei e operei uma instalação de visuais interativos, reagindo ao público em tempo real ao longo dos dois dias do evento."],
  ["MAD IN BRAZZA Festival 2026", "VJ", "2026-08-08", "Expotrade Convention Center, Pinhais (RMC), Curitiba - PR", "Operei os visuais ao vivo no festival MAD IN BRAZZA."],
  ["Festival Coolritiba 2026 — show da Budah", "VJ", "2026-05-23", "Pedreira Paulo Leminski / Ópera de Arame, Curitiba", "Operei os visuais ao vivo do show da Budah no Festival Coolritiba 2026."],
  ["Hopi Pride Festival 2026 — show da Duquesa", "VJ", "2026-04-25", "Hopi Hari, Vinhedo, SP", "Operei os visuais ao vivo do show da Duquesa no Hopi Pride Festival."],
  ["Risco:Brasília", "Instalação Artística", "2026-04-20", "CONIC, Setor de Diversões Sul, Brasília", "Co-criei e operei ao vivo a instalação, mixando meus visuais com os de VJ Grazzi e Visual Lores em uma performance colaborativa em tempo real."],
  ["Turnê \"Brutal Paraíso\" — Luísa Sonza", "Produção de Conteúdo", "2026-04-11", "Turnê nacional e internacional (Coachella, Virada Cultural SP, Goiânia, entre outras)", "Produzi o conteúdo visual usado na turnê \"Brutal Paraíso\", de Luísa Sonza, apresentada em vários palcos."],
  ["Coachella — Luísa Sonza", "Produção de Conteúdo", "2026-04-11", "Empire Polo Club, Indio, Califórnia (EUA)", "Produzi o conteúdo visual pré-renderizado em estúdio antes do evento e entreguei o material para exibição nas telas de LED do palco."],
  ["Prazer, Zezé! O Musical", "VJ", "2026-03-20", "Teatro Raul Cortez, Sesc 14 Bis, São Paulo", "Integrei a equipe de videografismo do musical, operando projeções ao vivo sincronizadas cena a cena com a direção artística ao longo da temporada."],
  ["Colóquio Internacional Oyapock", "Produção de Conteúdo", "2025-11-26", "Museu da Língua Portuguesa, São Paulo", "Produzi e operei o filme em fulldome \"Maluwana\" para o Colóquio Internacional Oyapock, com Visuallores e VJ Grazzi."],
  ["Centro Cultural Sesc - DF", "VJ", "2025-10-04", "511 Norte, Brasília, DF", "Integrei a equipe de visuais do espetáculo de abertura, operando projeções ao vivo sincronizadas com a narração e a trilha sonora do show imersivo."],
  ["Festival Beco Elétrico — Edição de 6 Anos", "VJ", "2024-07-13", "Teatro de Arena do Cave, Guará II, Brasília", "Atuei como VJ e criei conteúdo visual, mixando material próprio ao vivo durante os sets dos DJs da 6ª edição do festival."],
  ["Tropical Jazz", "VJ", "2023-12-09", "Praça das Fontes, Parque da Cidade, Brasília", "Fiz VJing ao vivo ao ar livre, traduzindo em tempo real os arranjos de jazz e MPB do line-up em visuais orgânicos e fluidos projetados na praça."],
  ["Emopalooza de Halloween", "VJ", "2023-10-28", "Outro Calaf, Setor Bancário Sul, Brasília, DF", "Criei os visuais na estética emo e mixei os vídeos ao vivo em VJ set durante a festa."],
  ["Festival Halloweeknd", "VJ", "2023-10-27", "Parque do Terror, Ginásio Nilson Nelson, Brasília", "Assinei a direção visual ao vivo do festival, mixando texturas orgânicas e efeitos de glitch em tempo real para cada uma das três noites temáticas."],
  ["Anabelle Estética", "Design", "2023-06-01", "Brasília, DF", "Identidade visual e UI para a Anabelle Estética."],
  ["BudX", "VJ", "2022-11-19", "Estádio Mané Garrincha (Arena BRB), Brasília", "Operei os visuais ao vivo, mixando meu conteúdo próprio com o material da festa e cedendo espaço ao VJ artista convidado quando havia um se apresentando, durante toda a Copa do Mundo 2022."],
  ["1º Festival Fyah — Cultura Black", "VJ", "2018-11-30", "Estádio Nacional de Brasília (Mané Garrincha), Brasília", "Mixei meus visuais ao vivo durante todos os shows do festival, adaptando o conteúdo ao estilo de cada atração (reggae, rap e banda local)."],
  ["VJ Torna 2018", "VJ", "2018-08-24", "Praça dos Três Poderes (Panteão da Pátria), Brasília", "Competi ao vivo no campeonato VJ Torna 2018, criando visuais improvisados em tempo real sincronizados com os sets dos DJs convidados, a céu aberto."],
];

const FEATURED = new Set([1, 10, 4, 8, 12]);

export const sampleProjects: Project[] = rows.map(([title, category, date, location, description], index) => {
  const slug = slugify(title);
  const local = getLocalMedia(slug);
  return {
  id: `sample-${index}`,
  slug,
  title,
  description,
  category,
  tags: [],
  date,
  endDate: null,
  year: Number(date.slice(0, 4)),
  location,
  featured: FEATURED.has(index),
  cover: null,
  thumbnail: local.photos[0] ? { kind: "image" as const, src: local.photos[0].src } : null,
  videoUrl: null,
  photos: local.photos,
  instagram: local.instagram,
  };
});

function text(content: string): RichText[] {
  return [
    {
      type: "text",
      plain_text: content,
      href: null,
      annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: "default" },
    },
  ];
}

function block(type: string, data: Record<string, unknown>, id: string): NotionBlock {
  return { object: "block", id, type, has_children: false, [type]: data };
}

export function sampleBlocks(pageId: string): NotionBlock[] {
  const project = sampleProjects.find((p) => p.id === pageId);
  if (!project) return [];
  return [
    block("heading_2", { rich_text: text("Meu trabalho") }, `${pageId}-h`),
    block("paragraph", { rich_text: text(project.description) }, `${pageId}-p`),
    block(
      "callout",
      {
        rich_text: text(
          "Conteúdo de exemplo. Configure NOTION_TOKEN e NOTION_DATABASE_ID para carregar o texto, as fotos e os vídeos reais do Notion.",
        ),
        icon: null,
      },
      `${pageId}-c`,
    ),
  ];
}
