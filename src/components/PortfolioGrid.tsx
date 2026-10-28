"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Project } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import styles from "./PortfolioGrid.module.css";

// null = todas as categorias.
type Labels = { all: string; filterLabel: string; countWord: string; empty: string };

export function PortfolioGrid({ projects, lang, labels }: { projects: Project[]; lang: Locale; labels: Labels }) {
  const [active, setActive] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      if (project.category) counts.set(project.category, (counts.get(project.category) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [projects]);

  const visible = active === null ? projects : projects.filter((project) => project.category === active);

  return (
    <>
      {categories.length > 1 ? (
        <div className={styles.filters} role="group" aria-label={labels.filterLabel}>
          {[[null, projects.length] as const, ...categories].map(([name, count]) => (
            <button
              key={name ?? "all"}
              type="button"
              className={styles.filter}
              aria-pressed={active === name}
              onClick={() => setActive(name)}
            >
              {name ?? labels.all}
              <span className={styles.count}>{count}</span>
            </button>
          ))}
        </div>
      ) : null}

      <p className="visually-hidden" aria-live="polite">
        {visible.length} {labels.countWord}
      </p>

      {visible.length > 0 ? (
        <div className={styles.grid}>
          {visible.map((project, index) => (
            <ProjectCard key={project.id} project={project} lang={lang} priority={index < 3} headingLevel="h2" />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          {labels.empty}
        </p>
      )}
    </>
  );
}
