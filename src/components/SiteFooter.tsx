import Link from "next/link";
import { getDictionary, href, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import styles from "./SiteFooter.module.css";

export function SiteFooter({ lang }: { lang: Locale }) {
  const t = getDictionary(lang);
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.cta}>
          <p className={styles.lead}>{t.footer.lead}</p>
          <a className={styles.email} href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>
        </div>

        <ul role="list" className={styles.links}>
          <li>
            <a href={site.contact.instagram.url} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </li>
          {site.contact.others.map((channel) => (
            <li key={channel.url}>
              <a href={channel.url} target="_blank" rel="noopener noreferrer">
                {channel.label}
              </a>
            </li>
          ))}
          <li>
            <Link href={href(lang, "/contato")}>{t.footer.allContacts}</Link>
          </li>
        </ul>

        <p className={styles.legal}>
          {site.person}, {t.city}. © {year}
        </p>
      </div>
    </footer>
  );
}
