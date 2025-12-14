import Link from "next/link";
import { notFound } from "next/navigation";
import { getShowcaseBySlug, getAllShowcaseSlugs, showcaseItems } from "../../data/showcase";
import Navigation from "../../components/Navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllShowcaseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = getShowcaseBySlug(slug);

  if (!item) {
    return { title: "Work Not Found" };
  }

  return {
    title: `${item.title} | Lucas`,
    description: item.description,
  };
}

export default async function ShowcaseItemPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getShowcaseBySlug(slug);

  if (!item) {
    notFound();
  }

  // Get related items (same type or adjacent items)
  const relatedItems = showcaseItems
    .filter((i) => i.type === item.type && i.id !== item.id)
    .slice(0, 3);

  // If not enough related items by type, get other items
  if (relatedItems.length < 3) {
    const otherItems = showcaseItems
      .filter((i) => i.id !== item.id && !relatedItems.includes(i))
      .slice(0, 3 - relatedItems.length);
    relatedItems.push(...otherItems);
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#0a0a0a]">
        {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-30`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />

        <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pt-32">
          <Link
            href="/showcase"
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
            Back to Showcase
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                  {item.type}
                </span>
                <span className="text-white/60 font-mono text-sm">
                  {item.year}
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
                {item.title}
              </h1>

              <p className="text-xl text-white/80 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Featured image */}
            <div
              className={`aspect-square rounded-3xl bg-gradient-to-br ${item.gradient} shadow-2xl shadow-black/50`}
            />
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-3">
                  Category
                </h3>
                <p className="text-white text-lg font-semibold">{item.type}</p>
              </div>

              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-3">
                  Year
                </h3>
                <p className="text-white text-lg font-semibold">{item.year}</p>
              </div>

              <div>
                <h3 className="text-sm text-zinc-500 uppercase tracking-wider mb-3">
                  Tools Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-sm text-zinc-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="md:col-span-2">
              <h2 className="font-display text-2xl font-bold text-white mb-8">
                Gallery
              </h2>
              <div className="grid gap-6">
                {item.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-2xl overflow-hidden"
                    style={{ background: image }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-display text-3xl font-bold text-white mb-12 text-center">
            Creative Process
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Research",
                description: "Understanding the context and gathering inspiration",
              },
              {
                step: "02",
                title: "Concept",
                description: "Developing ideas and exploring different directions",
              },
              {
                step: "03",
                title: "Execute",
                description: "Bringing the vision to life with precision",
              },
              {
                step: "04",
                title: "Refine",
                description: "Polishing every detail to perfection",
              },
            ].map((phase, index) => (
              <div key={index} className="relative">
                {/* Connecting line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#2a2a2a] to-transparent" />
                )}

                <div className="text-5xl font-display font-bold text-[#ff6b35]/20 mb-4">
                  {phase.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {phase.title}
                </h3>
                <p className="text-zinc-500">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Work */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-display text-2xl font-bold text-white mb-8">
            More Creative Work
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedItems.map((relatedItem) => (
              <Link
                href={`/showcase/${relatedItem.slug}`}
                key={relatedItem.id}
                className="group relative aspect-square rounded-2xl overflow-hidden"
              >
                {/* Gradient background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${relatedItem.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                  <span className="text-xs text-white/70 font-mono uppercase tracking-wider mb-1">
                    {relatedItem.type}
                  </span>
                  <h3 className="text-xl font-display font-bold text-white">
                    {relatedItem.title}
                  </h3>
                </div>

                {/* Permanent title */}
                <div className="absolute bottom-6 left-6 group-hover:opacity-0 transition-opacity">
                  <h3 className="text-lg font-display font-bold text-white drop-shadow-lg">
                    {relatedItem.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 border-t border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between">
            <Link
              href="/showcase"
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
              All Work
            </Link>
            <Link
              href="/#contact"
              className="flex items-center gap-2 px-6 py-3 bg-[#ff6b35] text-black font-semibold rounded-full hover:bg-[#ff8555] transition-all"
            >
              Work Together
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

