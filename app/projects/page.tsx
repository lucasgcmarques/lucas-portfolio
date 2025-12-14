import Link from "next/link";
import { projects } from "../data/projects";
import Navigation from "../components/Navigation";

export const metadata = {
  title: "Projects | Lucas",
  description: "Explore my portfolio of web development and design projects.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff6b35]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#4ecdc4]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>

          <span className="text-[#ff6b35] font-mono text-sm tracking-widest uppercase mb-4 block">
            Portfolio
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
            All Projects
          </h1>
          <p className="max-w-2xl text-xl text-zinc-400">
            A comprehensive collection of my development and design work.
            Each project showcases unique challenges and creative solutions.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="border-b border-[#1f1f1f] sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-hide">
            {["All", "Web Development", "UI/UX Design", "Mobile Development", "Web Application"].map(
              (filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    filter === "All"
                      ? "bg-[#ff6b35] text-black"
                      : "text-zinc-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  {filter}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Link
                href={`/projects/${project.slug}`}
                key={project.id}
                className="group relative bg-[#111] rounded-2xl overflow-hidden border border-[#1f1f1f] hover:border-[#ff6b35]/50 transition-all duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Project image/gradient */}
                <div className="relative h-56 overflow-hidden">
                  <div
                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                    style={{ background: project.image }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />

                  {/* Year badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white font-mono">
                      {project.year}
                    </span>
                  </div>

                  {/* View arrow */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                    <svg
                      className="w-5 h-5 text-white"
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
                  </div>
                </div>

                {/* Project info */}
                <div className="p-6">
                  <span className="text-[#ff6b35] text-xs font-mono uppercase tracking-wider">
                    {project.category}
                  </span>

                  <h3 className="text-xl font-display font-bold text-white mt-2 mb-3 group-hover:text-[#ff6b35] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-[#1a1a1a] rounded-md text-xs text-zinc-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
            Have a project in mind?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            I&apos;m always looking for new challenges and opportunities to create
            something amazing.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#ff6b35] text-black font-semibold rounded-full hover:bg-[#ff8555] transition-all hover:scale-105 active:scale-95"
          >
            Let&apos;s Talk
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
      </section>
    </main>
    </>
  );
}

