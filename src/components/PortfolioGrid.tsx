"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import styles from "./PortfolioGrid.module.css";

const ALL = "Todos";

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string>(ALL);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      if (project.category) counts.set(project.category, (counts.get(project.category) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [projects]);

  const visible = active === ALL ? projects : projects.filter((project) => project.category === active);

  return (
    <>
      {categories.length > 1 ? (
        <div className={styles.filters} role="group" aria-label="Filtrar por categoria">
          {[[ALL, projects.length] as const, ...categories].map(([name, count]) => (
            <button
              key={name}
              type="button"
              className={styles.filter}
              aria-pressed={active === name}
              onClick={() => setActive(name)}
            >
              {name}
              <span className={styles.count}>{count}</span>
            </button>
          ))}
        </div>
      ) : null}

      <p className="visually-hidden" aria-live="polite">
        {visible.length} projetos
      </p>

      {visible.length > 0 ? (
        <div className={styles.grid}>
          {visible.map((project, index) => (
            <ProjectCard key={project.id} project={project} priority={index < 3} headingLevel="h2" />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          Nenhum projeto publicado ainda. Adicione projetos ao database VJ Projects no Notion.
        </p>
      )}
    </>
  );
}
