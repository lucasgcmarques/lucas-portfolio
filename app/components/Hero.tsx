"use client";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-[#ff6b35]/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-[#4ecdc4]/15 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32">
        <div className="flex flex-col items-center text-center">
          {/* Status badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-[#4ecdc4] rounded-full animate-ping" />
            <span className="w-2 h-2 bg-[#4ecdc4] rounded-full absolute" />
            <span className="text-sm text-zinc-400">
              Available for new projects
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 animate-fade-in-up">
            Creative
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#ff6b35] via-[#ff8555] to-[#4ecdc4]">
              Developer
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl text-lg md:text-xl text-zinc-400 mb-12 leading-relaxed animate-fade-in-up delay-200">
            Crafting digital experiences that blend stunning visuals with
            seamless functionality. Specializing in modern web development and
            creative solutions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
            <a
              href="#portfolio"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#ff6b35] text-black font-semibold rounded-full hover:bg-[#ff8555] transition-all hover:scale-105 active:scale-95"
            >
              View My Work
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
            </a>
            <a
              href="#about"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-[#2a2a2a] text-white font-semibold rounded-full hover:bg-[#1a1a1a] hover:border-[#3a3a3a] transition-all"
            >
              About Me
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-zinc-600 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-zinc-400 rounded-full animate-scroll" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
