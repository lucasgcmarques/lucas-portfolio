import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { href, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

// Sempre gerado na hora: lê o conteúdo do CMS (já em cache), então é barato
// e nunca fica para trás depois de um salvamento.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const projects = await getProjects();
  const paths = ["/", "/portfolio", "/art", "/sobre", "/contato", ...projects.map((project) => `/portfolio/${project.slug}`)];
  return locales.flatMap((lang) => paths.map((path) => ({ url: `${base}${href(lang, path)}` })));
}
