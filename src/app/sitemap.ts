import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const projects = await getProjects();
  const pages = ["", "/portfolio", "/sobre", "/contato"].map((path) => ({ url: `${base}${path}` }));
  return [...pages, ...projects.map((project) => ({ url: `${base}/portfolio/${project.slug}` }))];
}
