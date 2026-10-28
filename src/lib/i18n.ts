/**
 * Idiomas do site. Português fica sem prefixo na URL (/sobre); inglês e
 * francês ganham prefixo (/en/sobre, /fr/sobre). O proxy faz essa ponte.
 * O conteúdo vindo do Notion (títulos e textos dos projetos) não é traduzido.
 */

export const locales = ["pt", "en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Monta o link no idioma: href("en", "/sobre") → "/en/sobre". */
export function href(lang: Locale, path: string): string {
  if (lang === defaultLocale) return path;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}

/** Tira o prefixo de idioma de um caminho: "/fr/sobre" → "/sobre". */
export function stripLocale(pathname: string): string {
  const match = pathname.match(/^\/(en|fr|pt)(?=\/|$)/);
  if (!match) return pathname;
  return pathname.slice(match[0].length) || "/";
}

const pt = {
  htmlLang: "pt-BR",
  ogLocale: "pt_BR",
  dateLocale: "pt-BR",
  languageName: "Português",

  city: "São Paulo, Brasil",
  role: "VJ e artista visual",
  description:
    "Lucas Guimarães (VJ Olho Negro) cria visuais ao vivo, video mapping, 3D e motion para shows, festivais, teatro e marcas.",
  disciplines: ["VJ", "Performance", "Arte visual", "Programação", "Animação", "Design"],
  tagline: "Criação sem limites.",

  nav: { portfolio: "Portfólio", about: "Sobre", contact: "Contato", main: "Principal", language: "Idioma", openMenu: "Abrir menu", closeMenu: "Fechar menu" },
  skipLink: "Pular para o conteúdo",
  homeLabel: "VJ Olho Negro, página inicial",

  home: {
    seePortfolio: "Ver o portfólio",
    talk: "Vamos conversar",
    featured: "Trabalhos em destaque",
    allProjects: (n: number) => `Todos os ${n} projetos`,
    credits: "Palcos e artistas",
  },

  portfolio: {
    title: "Portfólio",
    description: "Shows, festivais, turnês, instalações e conteúdo visual criados por Lucas Guimarães (VJ Olho Negro).",
    all: "Todos",
    filterLabel: "Filtrar por categoria",
    countWord: "projetos",
    empty: "Nenhum projeto publicado ainda. Adicione projetos ao database VJ Projects no Notion.",
  },

  project: {
    notFound: "Projeto não encontrado",
    date: "Data",
    location: "Local",
    category: "Categoria",
    tags: "Tags",
    others: "Outros projetos",
    newer: "Mais recente",
    older: "Anterior",
    video: "Vídeo do projeto",
    download: "Baixar arquivo",
  },

  about: {
    title: "Sobre",
    description: "Lucas Guimarães, VJ e artista visual em São Paulo: bio e trajetória.",
    bioLabel: "Biografia",
    bio: [
      "Sou Lucas Guimarães, VJ e artista visual. Comecei em computação gráfica e 3D em Brasília, em 2014, e hoje vivo em São Paulo. Desde então, fui levando isso para a pista, o palco e o espaço: visuais ao vivo, video mapping, cenografia digital e instalações que reagem ao público.",
      "Boa parte do que faço nasce de código. Uso creative coding, principalmente em TouchDesigner, para criar sistemas visuais generativos e interativos: imagens que respondem ao som, ao movimento e às pessoas, em vez de só tocar a partir de um arquivo. Programar, para mim, é mais uma forma de desenhar.",
      "Também crio visuais, animações e motion graphics do zero, em 3D e 2D, para shows, turnês, festivais e marcas. Trabalho tanto na operação ao vivo, sincronizando imagem e música em tempo real, quanto em estúdio, produzindo conteúdo pré-renderizado para telas de LED.",
    ],
    artAlt: "Arte em 3D de um organismo verde translúcido com tubos cromados e tipografia pixelada",
    timeline: "Trajetória",
  },

  contact: {
    title: "Contato",
    description:
      "Fale com Lucas Guimarães (VJ Olho Negro) sobre shows, festivais, turnês, instalações e conteúdo visual.",
    hint: "Para orçamentos, mande a data, a cidade, o tipo de evento e o que você imagina para os visuais.",
    copy: "Copiar e-mail",
    copied: "E-mail copiado",
    bandAlt: "Tipografia pixelada com textura cromada formando as palavras visual, techno e artista",
    location: "Baseado em São Paulo. Disponível para trabalhos no Brasil e no exterior.",
  },

  footer: {
    lead: "Tem um show, festival ou ativação vindo aí?",
    allContacts: "Todos os contatos",
  },

  notFound: {
    title: "Sem sinal",
    before: "Esta página não existe ou o projeto saiu do ar. Veja todos os trabalhos no",
    link: "portfólio",
  },
};

export type Dictionary = typeof pt;

const en: Dictionary = {
  htmlLang: "en",
  ogLocale: "en_US",
  dateLocale: "en-US",
  languageName: "English",

  city: "São Paulo, Brazil",
  role: "VJ and visual artist",
  description:
    "Lucas Guimarães (VJ Olho Negro) makes live visuals, projection mapping, 3D and motion for shows, festivals, theatre and brands.",
  disciplines: ["VJ", "Performance", "Visual Art", "Programming", "Animation", "Design"],
  tagline: "Creation beyond limits.",

  nav: { portfolio: "Portfolio", about: "About", contact: "Contact", main: "Main", language: "Language", openMenu: "Open menu", closeMenu: "Close menu" },
  skipLink: "Skip to content",
  homeLabel: "VJ Olho Negro, home",

  home: {
    seePortfolio: "See the portfolio",
    talk: "Let's talk",
    featured: "Featured work",
    allProjects: (n: number) => `All ${n} projects`,
    credits: "Stages and artists",
  },

  portfolio: {
    title: "Portfolio",
    description: "Shows, festivals, tours, installations and visual content by Lucas Guimarães (VJ Olho Negro).",
    all: "All",
    filterLabel: "Filter by category",
    countWord: "projects",
    empty: "No projects published yet.",
  },

  project: {
    notFound: "Project not found",
    date: "Date",
    location: "Location",
    category: "Category",
    tags: "Tags",
    others: "Other projects",
    newer: "Newer",
    older: "Older",
    video: "Project video",
    download: "Download file",
  },

  about: {
    title: "About",
    description: "Lucas Guimarães, VJ and visual artist in São Paulo: bio and timeline.",
    bioLabel: "Biography",
    bio: [
      "I'm Lucas Guimarães, a VJ and visual artist. I started out in computer graphics and 3D in Brasília in 2014, and now live in São Paulo. Since then I've been taking it to the dancefloor, the stage and physical space: live visuals, projection mapping, digital scenography and installations that react to the crowd.",
      "A lot of what I do starts as code. I use creative coding, mostly in TouchDesigner, to build generative and interactive visual systems: images that respond to sound, movement and people instead of just playing back from a file. For me, programming is another way of drawing.",
      "I also create visuals, animation and motion graphics from scratch, in 3D and 2D, for shows, tours, festivals and brands. I work both live, syncing image and music in real time, and in the studio, producing pre-rendered content for LED screens.",
    ],
    artAlt: "3D artwork of a translucent green organism with chrome tubes and pixel typography",
    timeline: "Timeline",
  },

  contact: {
    title: "Contact",
    description:
      "Talk to Lucas Guimarães (VJ Olho Negro) about shows, festivals, tours, installations and visual content.",
    hint: "For quotes, send the date, the city, the kind of event and what you picture for the visuals.",
    copy: "Copy e-mail",
    copied: "E-mail copied",
    bandAlt: "Chrome-textured pixel typography spelling visual, techno and artist",
    location: "Based in São Paulo. Available for work in Brazil and abroad.",
  },

  footer: {
    lead: "Got a show, festival or activation coming up?",
    allContacts: "All contacts",
  },

  notFound: {
    title: "No signal",
    before: "This page doesn't exist or the project went offline. See all the work in the",
    link: "portfolio",
  },
};

const fr: Dictionary = {
  htmlLang: "fr",
  ogLocale: "fr_FR",
  dateLocale: "fr-FR",
  languageName: "Français",

  city: "São Paulo, Brésil",
  role: "VJ et artiste visuel",
  description:
    "Lucas Guimarães (VJ Olho Negro) crée des visuels live, du vidéo mapping, de la 3D et du motion pour concerts, festivals, théâtre et marques.",
  disciplines: ["VJ", "Performance", "Art visuel", "Programmation", "Animation", "Design"],
  tagline: "Création sans limites.",

  nav: { portfolio: "Portfolio", about: "À propos", contact: "Contact", main: "Principal", language: "Langue", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu" },
  skipLink: "Aller au contenu",
  homeLabel: "VJ Olho Negro, accueil",

  home: {
    seePortfolio: "Voir le portfolio",
    talk: "On en parle ?",
    featured: "Projets à la une",
    allProjects: (n: number) => `Les ${n} projets`,
    credits: "Scènes et artistes",
  },

  portfolio: {
    title: "Portfolio",
    description: "Concerts, festivals, tournées, installations et contenus visuels de Lucas Guimarães (VJ Olho Negro).",
    all: "Tous",
    filterLabel: "Filtrer par catégorie",
    countWord: "projets",
    empty: "Aucun projet publié pour l'instant.",
  },

  project: {
    notFound: "Projet introuvable",
    date: "Date",
    location: "Lieu",
    category: "Catégorie",
    tags: "Tags",
    others: "Autres projets",
    newer: "Plus récent",
    older: "Précédent",
    video: "Vidéo du projet",
    download: "Télécharger le fichier",
  },

  about: {
    title: "À propos",
    description: "Lucas Guimarães, VJ et artiste visuel à São Paulo : bio et parcours.",
    bioLabel: "Biographie",
    bio: [
      "Je suis Lucas Guimarães, VJ et artiste visuel. J'ai commencé par l'infographie et la 3D à Brasília en 2014, et je vis aujourd'hui à São Paulo. Depuis, j'emmène tout ça sur le dancefloor, la scène et l'espace : visuels live, vidéo mapping, scénographie numérique et installations qui réagissent au public.",
      "Une grande partie de mon travail naît du code. J'utilise le creative coding, surtout dans TouchDesigner, pour créer des systèmes visuels génératifs et interactifs : des images qui réagissent au son, au mouvement et aux gens, au lieu de simplement lire un fichier. Pour moi, programmer est une autre façon de dessiner.",
      "Je crée aussi des visuels, des animations et du motion design de A à Z, en 3D et en 2D, pour des concerts, tournées, festivals et marques. Je travaille aussi bien en live, en synchronisant image et musique en temps réel, qu'en studio, en produisant des contenus précalculés pour écrans LED.",
    ],
    artAlt: "Image 3D d'un organisme vert translucide avec des tubes chromés et une typographie pixelisée",
    timeline: "Parcours",
  },

  contact: {
    title: "Contact",
    description:
      "Parlez avec Lucas Guimarães (VJ Olho Negro) de concerts, festivals, tournées, installations et contenus visuels.",
    hint: "Pour un devis, envoyez la date, la ville, le type d'événement et ce que vous imaginez pour les visuels.",
    copy: "Copier l'e-mail",
    copied: "E-mail copié",
    bandAlt: "Typographie pixelisée à texture chromée formant les mots visual, techno et artista",
    location: "Basé à São Paulo. Disponible pour des projets au Brésil et à l'étranger.",
  },

  footer: {
    lead: "Un concert, un festival ou une activation en vue ?",
    allContacts: "Tous les contacts",
  },

  notFound: {
    title: "Pas de signal",
    before: "Cette page n'existe pas ou le projet a été retiré. Voir tous les projets dans le",
    link: "portfolio",
  },
};

const dictionaries: Record<Locale, Dictionary> = { pt, en, fr };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}
