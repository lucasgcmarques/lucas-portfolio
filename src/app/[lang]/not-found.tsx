"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary, hasLocale, href } from "@/lib/i18n";

// O not-found não recebe params: o idioma vem do prefixo da URL.
export default function NotFound() {
  const first = (usePathname() ?? "/").split("/")[1] ?? "";
  const lang = hasLocale(first) ? first : "pt";
  const t = getDictionary(lang).notFound;

  return (
    <div className="container">
      <h1 className="page-title">{t.title}</h1>
      <p style={{ maxWidth: "48ch", color: "var(--ash)" }}>
        {t.before}{" "}
        <Link href={href(lang, "/portfolio")} style={{ color: "var(--bone)" }}>
          {t.link}
        </Link>
        .
      </p>
    </div>
  );
}
