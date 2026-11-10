import "server-only";
import { artWorks } from "./art";
import type { SiteContent } from "./content-types";
import { getDictionary } from "./i18n";
import { getSourceProjects } from "./projects";
import { site } from "./site";

/**
 * Conteúdo de partida do CMS: o que o site mostra hoje (projetos com fotos e
 * vídeos locais, Art, bio, contato). O /admin abre com isto até o primeiro
 * salvamento; daí em diante tudo vem do Blob.
 */
export async function buildSeedContent(): Promise<SiteContent> {
  const projects = await getSourceProjects();
  const bio = (lang: "pt" | "en" | "fr") => getDictionary(lang).about.bio.join("\n\n");

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    heroVideo: process.env.HERO_VIDEO_URL ?? "",
    projects: projects.map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      description: project.description,
      body: "",
      category: project.category ?? "",
      tags: project.tags,
      date: project.date ?? "",
      endDate: project.endDate ?? "",
      location: project.location ?? "",
      featured: project.featured,
      published: true,
      cover: project.cover?.src ?? "",
      photos: project.photos,
      videos: [project.videoUrl, ...project.videos].filter((url): url is string => Boolean(url)),
      instagram: project.instagram,
    })),
    art: artWorks.map((work, index) => ({
      id: `art-${index}`,
      src: work.src,
      kind: work.kind,
      category: work.category,
      alt: work.alt,
      title: work.title ?? "",
      size: work.size ?? "small",
    })),
    about: {
      bio: { pt: bio("pt"), en: bio("en"), fr: bio("fr") },
      art: "/images/organismo.png",
      artAlt: getDictionary("pt").about.artAlt,
      credits: [...site.credits],
    },
    contact: {
      email: site.contact.email,
      phoneDisplay: site.contact.phoneDisplay,
      whatsapp: site.contact.whatsapp,
      instagramHandle: site.contact.instagram.handle,
      instagramUrl: site.contact.instagram.url,
      others: [...site.contact.others],
    },
  };
}
