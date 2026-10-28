import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { href, locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const projects = await getProjects();
  const paths = ["/", "/portfolio", "/sobre", "/contato", ...projects.map((project) => `/portfolio/${project.slug}`)];
  return locales.flatMap((lang) => paths.map((path) => ({ url: `${base}${href(lang, path)}` })));
}
