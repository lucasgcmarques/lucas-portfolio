import Link from "next/link";
import { showcaseItems } from "../data/showcase";
import Navigation from "../components/Navigation";

export const metadata = {
  title: "Showcase | Lucas",
  description: "Explore my creative work including branding, motion graphics, 3D design, and more.",
};

const categories = [
  "All",
  "Branding",
  "Animation",
  "3D Design",
  "WebGL",
  "Photography",
  "Design System",
  "Illustration",
];

export default function ShowcasePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-gradient-radial from-[#ff6b35]/15 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-[#4ecdc4]/10 via-transparent to-transparent rounded-full blur-3xl" />
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
            Showcase
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
            Creative Work
          </h1>
          <p className="max-w-2xl text-xl text-zinc-400">
            Exploring different mediums and pushing creative boundaries.
            From branding to 3D visualization, each piece tells a unique story.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="border-b border-[#1f1f1f] sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-xl z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-1 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === "All"
                    ? "bg-[#ff6b35] text-black"
                    : "text-zinc-400 hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {showcaseItems.map((item, index) => {
              // Vary heights for masonry effect
              const heights = ["h-64", "h-80", "h-72", "h-96", "h-56", "h-72"];
              const height = heights[index % heights.length];

              return (
                <Link
                  href={`/showcase/${item.slug}`}
                  key={item.id}
                  className={`group relative block rounded-2xl overflow-hidden break-inside-avoid ${height}`}
                >
                  {/* Gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Top - Type badge */}
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs text-white font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        {item.type}
                      </span>

                      {/* Arrow icon */}
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
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

                    {/* Bottom - Title */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-white/70 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Permanent title (visible when not hovering) */}
                  <div className="absolute bottom-6 left-6 right-6 group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-lg font-display font-bold text-white drop-shadow-lg">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-t border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "50+", label: "Creative Projects" },
              { value: "8", label: "Design Categories" },
              { value: "15+", label: "Tools Mastered" },
              { value: "100%", label: "Passion" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b35] to-[#4ecdc4] mb-2">
                  {stat.value}
                </div>
                <div className="text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
            Want something unique?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            I create custom designs that capture your brand&apos;s essence and
            connect with your audience.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#ff6b35] text-black font-semibold rounded-full hover:bg-[#ff8555] transition-all hover:scale-105 active:scale-95"
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
      </section>
    </main>
    </>
  );
}

