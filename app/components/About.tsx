"use client";

const skills = [
  { name: "React / Next.js", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "Node.js", level: 85 },
  { name: "UI/UX Design", level: 80 },
  { name: "Three.js / WebGL", level: 75 },
];

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "50+", label: "Projects Completed" },
  { value: "30+", label: "Happy Clients" },
  { value: "10+", label: "Awards Won" },
];

export default function About() {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-[#ff6b35]/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}´
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-[#ff6b35] font-mono text-sm tracking-widest uppercase mb-4 block">
              About Me
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
              Turning ideas into
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#ff6b35] to-[#4ecdc4]">
                digital reality
              </span>
            </h2>
          </div>
          <p className="max-w-md text-zinc-400 mt-6 md:mt-0 leading-relaxed">
            I&apos;m a passionate developer and designer who loves creating
            beautiful, functional digital experiences that make a difference.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left column - About text */}
          <div className="space-y-8">
            <div className="space-y-6 text-zinc-300 leading-relaxed">
              <p>
                With over 5 years of experience in web development, I&apos;ve
                had the privilege of working with startups and established
                companies alike, helping them bring their visions to life
                through code.
              </p>
              <p>
                My approach combines technical expertise with creative thinking.
                I believe that the best digital products are those that not only
                work flawlessly but also delight users with thoughtful design
                and smooth interactions.
              </p>
              <p>
                When I&apos;m not coding, you&apos;ll find me exploring new
                technologies, contributing to open-source projects, or sharing
                my knowledge through writing and mentoring.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#1f1f1f]">
              {stats.map((stat) => (
                <div key={stat.label} className="group">
                  <div className="text-4xl font-display font-bold text-white group-hover:text-[#ff6b35] transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Skills */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-8">
              Core Skills
            </h3>
            {skills.map((skill) => (
              <div key={skill.name} className="group">
                <div className="flex justify-between mb-2">
                  <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">
                    {skill.name}
                  </span>
                  <span className="text-zinc-500 text-sm">{skill.level}%</span>
                </div>
                <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#ff6b35] to-[#ff8555] rounded-full transition-all duration-1000 ease-out group-hover:from-[#4ecdc4] group-hover:to-[#45b7aa]"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Tech stack icons */}
            <div className="pt-8 border-t border-[#1f1f1f] mt-8">
              <h3 className="text-lg font-semibold text-white mb-6">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "React",
                  "Next.js",
                  "TypeScript",
                  "Node.js",
                  "Tailwind",
                  "Figma",
                  "PostgreSQL",
                  "AWS",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-sm text-zinc-300 hover:border-[#ff6b35] hover:text-[#ff6b35] transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
