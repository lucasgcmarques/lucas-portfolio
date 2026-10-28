"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { href, stripLocale, type Locale } from "@/lib/i18n";
import styles from "./SiteHeader.module.css";

type Props = {
  lang: Locale;
  labels: {
    portfolio: string;
    about: string;
    contact: string;
    main: string;
    language: string;
    home: string;
    openMenu: string;
    closeMenu: string;
  };
  languages: { code: Locale; name: string }[];
};

export function SiteHeader({ lang, labels, languages }: Props) {
  // Caminho sem o prefixo de idioma, para comparar e trocar de língua.
  const fullPath = usePathname() ?? "/";
  const pathname = stripLocale(fullPath);
  // Menu do celular: abre por cima da página e fecha ao navegar ou com Esc.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [fullPath]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.documentElement.style.overflow = "";
    };
  }, [open]);
  const NAV = [
    { href: "/portfolio", label: labels.portfolio },
    { href: "/sobre", label: labels.about },
    { href: "/contato", label: labels.contact },
  ];

  return (
    <header className={styles.header} data-open={open || undefined}>
      <div className={`container ${styles.inner}`}>
        <Link href={href(lang, "/")} className={styles.brand} aria-label={labels.home}>
          <svg className={styles.logo} viewBox="0 0 1500.95 862.5" aria-hidden="true" focusable="false">
            <path d="M773.68,3.95C391.77,40.71,144.89,310.53,29.19,472.98c-52.09,73.14-32.39,174.61,42.62,223.97,125.14,82.33,354.84,182.19,718.35,163.2,460.54-24.06,631.12-214.83,692.04-327.26,25.4-46.89,24.91-103.7-.97-150.33C1406.36,247.67,1196.53-36.76,773.68,3.95ZM809.11,780.43c-238.17,22.19-515.15-70.19-532.51-256.49-17.36-186.31,231.48-395.99,469.65-418.18,67.76-6.31,140.05,2.74,209.22,23.15-81.76,31.7-151.5,101.75-154.71,175.12-4.46,102.02,121.43,171.81,236.63,176.84,95.99,4.2,206.51-32.58,243.32-103.97,8.07,19.67,13.44,39.76,15.34,60.11C1313.4,623.31,1047.29,758.24,809.11,780.43Z" />
          </svg>
        </Link>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="menu-principal"
          aria-label={open ? labels.closeMenu : labels.openMenu}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
        <nav id="menu-principal" aria-label={labels.main} className={styles.navWrap}>
          <ul role="list" className={styles.nav}>
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={href(lang, item.href)}
                    className={styles.link}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul role="list" className={styles.langs} aria-label={labels.language}>
            {languages.map((language) => (
              <li key={language.code}>
                <Link
                  href={href(language.code, pathname)}
                  hrefLang={language.code}
                  lang={language.code}
                  title={language.name}
                  className={styles.lang}
                  aria-current={language.code === lang ? "true" : undefined}
                >
                  {language.code.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
