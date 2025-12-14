"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/#hero", section: "hero" },
  { name: "About", href: "/#about", section: "about" },
  { name: "Projects", href: "/projects", section: "portfolio" },
  { name: "Showcase", href: "/showcase", section: "showcase" },
  { name: "Contact", href: "/#contact", section: "contact" },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (isHomePage) {
        const sections = navItems.map((item) => item.section);
        for (const section of [...sections].reverse()) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 150) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // If it's a hash link on the same page, scroll smoothly
    if (href.startsWith("/#") && isHomePage) {
      e.preventDefault();
      const element = document.querySelector(href.replace("/", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isActive = (item: (typeof navItems)[0]) => {
    if (!isHomePage) {
      return pathname.startsWith(
        item.href.replace("/#", "/").replace("#", "/")
      );
    }
    return activeSection === item.section;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#0d0d0d]/90 backdrop-blur-xl border-b border-[#1f1f1f]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="font-display text-2xl font-bold tracking-tight text-white hover:text-[#ff6b35] transition-colors"
          >
            Lucas<span className="text-[#ff6b35]">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                  isActive(item)
                    ? "text-[#ff6b35]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#ff6b35] transition-all duration-300 ${
                    isActive(item) ? "w-6" : "w-0 group-hover:w-4"
                  }`}
                />
              </Link>
            ))}
          </div>

          <Link
            href="/#contact"
            onClick={(e) => handleNavClick(e, "/#contact")}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-[#ff6b35] text-black font-semibold text-sm rounded-full hover:bg-[#ff8555] transition-all hover:scale-105 active:scale-95"
          >
            Let&apos;s Talk
            <svg
              className="w-4 h-4"
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

          {/* Mobile menu button */}
          <button className="md:hidden text-white p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
