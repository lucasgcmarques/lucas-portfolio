import "server-only";
import { artWorks, type ArtWork } from "./art";
import { getContent } from "./content-store";
import { paragraphs, type ContactContent } from "./content-types";
import { getDictionary, type Locale } from "./i18n";
import { site } from "./site";

/**
 * O que as páginas públicas mostram: o conteúdo do CMS quando existe, ou os
 * valores fixos do código enquanto nada foi salvo no /admin.
 */

export async function getContact(): Promise<ContactContent> {
  const content = await getContent();
  if (content) return content.contact;
  return {
    email: site.contact.email,
    phoneDisplay: site.contact.phoneDisplay,
    whatsapp: site.contact.whatsapp,
    instagramHandle: site.contact.instagram.handle,
    instagramUrl: site.contact.instagram.url,
    others: [...site.contact.others],
  };
}

export async function getAbout(lang: Locale) {
  const content = await getContent();
  const t = getDictionary(lang).about;
  const bio = content ? paragraphs(content.about.bio[lang]) : [];
  return {
    bio: bio.length > 0 ? bio : t.bio,
    art: content?.about.art || "/images/organismo.png",
    artAlt: content?.about.artAlt || t.artAlt,
    credits: content?.about.credits.length ? content.about.credits : [...site.credits],
  };
}

export async function getArtWorks(): Promise<ArtWork[]> {
  const content = await getContent();
  if (!content) return artWorks;
  return content.art
    .filter((work) => work.src && !work.hidden)
    .map((work) => ({
      src: work.src,
      kind: work.kind,
      category: work.category,
      alt: work.alt,
      title: work.title || undefined,
      size: work.size,
      poster: work.poster || undefined,
    }));
}

export async function getHeroVideo(): Promise<string | undefined> {
  const content = await getContent();
  return content?.heroVideo || undefined;
}
