import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjectSlugs, projects } from "../../data/projects";
import Navigation from "../../components/Navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | Lucas`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Get related projects (same category, excluding current)
  const relatedProjects = projects
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 2);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#0a0a0a]">
        {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{ background: project.image }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />

        <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pb-16">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
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
            Back to Projects
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-4 py-1.5 bg-[#ff6b35] text-black text-sm font-semibold rounded-full">
              {project.category}
            </span>
            <span className="text-white/60 font-mono text-sm">
              {project.year}
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
            {project.title}
          </h1>

          <p className="text-xl text-white/80 max-w-2xl">
            {project.description}
          </p>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Info cards */}
            <div className="space-y-6">
              <div className="p-6 bg-[#111] border border-[#1f1f1f] rounded-2xl">
                <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-2">
                  Client
                </h3>
                <p className="text-white font-semibold">{project.client}</p>
              </div>
              <div className="p-6 bg-[#111] border border-[#1f1f1f] rounded-2xl">
                <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-2">
                  Role
                </h3>
                <p className="text-white font-semibold">{project.role}</p>
              </div>
              <div className="p-6 bg-[#111] border border-[#1f1f1f] rounded-2xl">
                <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-2">
                  Year
                </h3>
                <p className="text-white font-semibold">{project.year}</p>
              </div>

              {/* Links */}
              <div className="flex gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#ff6b35] text-black font-semibold rounded-full hover:bg-[#ff8555] transition-all"
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Live
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold rounded-full hover:bg-[#222] transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Code
                  </a>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-4">
                  About the Project
                </h2>
                <p className="text-zinc-300 leading-relaxed text-lg">
                  {project.fullDescription}
                </p>
              </div>

              {/* Tech stack */}
              <div>
                <h3 className="font-display text-xl font-bold text-white mb-4">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-sm text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-display text-xl font-bold text-white mb-4">
                  Key Features
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-[#111] border border-[#1f1f1f] rounded-xl"
                    >
                      <div className="w-8 h-8 bg-[#ff6b35]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-[#ff6b35]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-zinc-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-display text-2xl font-bold text-white mb-8">
            Project Gallery
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {project.gallery.map((image, index) => (
              <div
                key={index}
                className="aspect-video rounded-2xl overflow-hidden"
                style={{ background: image }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-16 border-t border-[#1f1f1f]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="font-display text-2xl font-bold text-white mb-8">
              Related Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedProjects.map((relatedProject) => (
                <Link
                  href={`/projects/${relatedProject.slug}`}
                  key={relatedProject.id}
                  className="group relative bg-[#111] rounded-2xl overflow-hidden border border-[#1f1f1f] hover:border-[#ff6b35]/50 transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                      style={{ background: relatedProject.image }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="p-6">
                    <span className="text-[#ff6b35] text-xs font-mono uppercase tracking-wider">
                      {relatedProject.category}
                    </span>
                    <h3 className="text-xl font-display font-bold text-white mt-2 group-hover:text-[#ff6b35] transition-colors">
                      {relatedProject.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Navigation */}
      <section className="py-8 border-t border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            <Link
              href="/projects"
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
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
              All Projects
            </Link>
            <Link
              href="/#contact"
              className="flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-black font-semibold rounded-full hover:bg-[#ff8555] transition-all"
            >
              Start a Project
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
      </main>
    </>
  );
}

