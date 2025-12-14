import Link from "next/link";
import { projects } from "../data/projects";

export default function Portfolio() {
  return (
    <section id="portfolio" className="relative py-32">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-[#ff6b35] font-mono text-sm tracking-widest uppercase mb-4 block">
            Portfolio
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Featured Projects
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-400">
            A selection of my recent work. Each project represents a unique
            challenge and creative solution.
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.slice(0, 4).map((project, index) => (
            <Link
              href={`/projects/${project.slug}`}
              key={project.id}
              className="group relative bg-[#111] rounded-2xl overflow-hidden border border-[#1f1f1f] hover:border-[#2f2f2f] transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Project image/gradient */}
              <div
                className="h-64 w-full transition-transform duration-500 group-hover:scale-105"
                style={{ background: project.image }}
              >
                <div className="absolute inset-0 bg-linear-to-t from-[#111] via-transparent to-transparent opacity-60" />
              </div>

              {/* Project info */}
              <div className="relative p-8 -mt-16">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-xs text-[#ff6b35] font-medium">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-[#ff6b35] transition-colors">
                  {project.title}
                </h3>

                <p className="text-zinc-400 mb-6 line-clamp-2">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#0a0a0a] rounded-full text-xs text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* View project link */}
                <span className="inline-flex items-center gap-2 text-white font-medium group-hover:text-[#ff6b35] transition-colors">
                  View Project
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View all projects button */}
        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-[#2a2a2a] text-white font-semibold rounded-full hover:bg-[#1a1a1a] hover:border-[#3a3a3a] transition-all"
          >
            View All Projects
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
