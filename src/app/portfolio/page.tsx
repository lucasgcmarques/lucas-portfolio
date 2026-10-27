import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { getProjects } from "@/lib/projects";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Portfólio",
  description: "Shows, festivais, turnês, instalações e conteúdo visual criados por Lucas Guimarães (VJ Olho Negro).",
};

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="container">
      <h1 className="page-title">Portfólio</h1>
      <PortfolioGrid projects={projects} />
    </div>
  );
}
