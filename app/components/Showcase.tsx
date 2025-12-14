import Link from "next/link";
import { showcaseItems } from "../data/showcase";

const testimonials = [
  {
    quote:
      "Lucas delivered an exceptional website that exceeded our expectations. His attention to detail and creative solutions made all the difference.",
    author: "Sarah Johnson",
    role: "CEO, TechStart",
  },
  {
    quote:
      "Working with Lucas was a pleasure. He understood our vision perfectly and translated it into a beautiful, functional product.",
    author: "Michael Chen",
    role: "Founder, DesignLab",
  },
  {
    quote:
      "The best developer I've worked with. Professional, creative, and always delivers on time. Highly recommended!",
    author: "Emily Rodriguez",
    role: "Marketing Director, Bloom",
  },
];

export default function Showcase() {
  return (
    <section id="showcase" className="relative py-32 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#ff6b35]/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-[#ff6b35] font-mono text-sm tracking-widest uppercase mb-4 block">
            Showcase
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            Creative Work
          </h2>
          <p className="max-w-2xl mx-auto text-zinc-400">
            Exploring different mediums and pushing creative boundaries through
            diverse projects.
          </p>
        </div>

        {/* Showcase grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-24">
          {showcaseItems.slice(0, 6).map((item, index) => (
            <Link
              href={`/showcase/${item.slug}`}
              key={item.id}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                index === 0 || index === 5
                  ? "aspect-square md:col-span-1"
                  : "aspect-square"
              }`}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${item.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                <span className="text-xs text-white/70 font-mono uppercase tracking-wider mb-1">
                  {item.type}
                </span>
                <h3 className="text-lg md:text-xl font-display font-bold text-white">
                  {item.title}
                </h3>
              </div>

              {/* Arrow icon */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
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
            </Link>
          ))}
        </div>

        {/* View all showcase button */}
        <div className="text-center mb-24">
          <Link
            href="/showcase"
            className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-[#2a2a2a] text-white font-semibold rounded-full hover:bg-[#1a1a1a] hover:border-[#3a3a3a] transition-all"
          >
            View All Work
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

        {/* Testimonials */}
        <div className="border-t border-[#1f1f1f] pt-24">
          <h3 className="text-center text-2xl md:text-3xl font-display font-bold text-white mb-16">
            What Clients Say
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group p-8 bg-[#111] border border-[#1f1f1f] rounded-2xl hover:border-[#ff6b35]/30 transition-all duration-300"
              >
                {/* Quote icon */}
                <svg
                  className="w-10 h-10 text-[#ff6b35]/30 mb-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className="text-zinc-300 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-[#ff6b35] to-[#4ecdc4] rounded-full" />
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-zinc-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
