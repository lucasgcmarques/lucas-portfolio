import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyEmail } from "@/components/CopyEmail";
import { Decor } from "@/components/Decor";
import { GradientMask } from "@/components/GradientMask";
import { PixelLens } from "@/components/PixelLens";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { site } from "@/lib/site";
import styles from "./contact.module.css";

export async function generateMetadata({ params }: PageProps<"/[lang]/contato">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).contact;
  return { title: t.title, description: t.description };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contato">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang).contact;
  const channels = [
    { label: "Instagram", value: site.contact.instagram.handle, url: site.contact.instagram.url },
    { label: "WhatsApp", value: site.contact.phoneDisplay, url: site.contact.whatsapp },
    ...site.contact.others.map((channel) => ({ label: channel.label, value: channel.url.replace(/^https?:\/\/(www\.)?/, ""), url: channel.url })),
  ];

  return (
    <div className={`container ${styles.page}`}>
      <Decor shape={3} className={styles.pageDecor} />
      <h1 className="page-title">{t.title}</h1>

      <section className={styles.primary} aria-labelledby="email-label">
        <p id="email-label" className={styles.hint}>
          {t.hint}
        </p>
        <a className={styles.email} href={`mailto:${site.contact.email}`}>
          {site.contact.email}
        </a>
        <div className={styles.copy}>
          <CopyEmail email={site.contact.email} labels={{ copy: t.copy, copied: t.copied }} />
        </div>
      </section>

      <ul role="list" className={styles.channels}>
        {channels.map((channel) => (
          <li key={channel.label} className={styles.channel}>
            <span className={styles.channelLabel}>{channel.label}</span>
            <a href={channel.url} target="_blank" rel="noopener noreferrer" className={styles.channelValue}>
              {channel.value}
            </a>
          </li>
        ))}
      </ul>

      <figure className={styles.band}>
        <PixelLens border={false} radius={220} pixel={14}>
          <GradientMask
            src="/images/tipografia-pixel-recorte.png"
            alt={t.bandAlt}
            width={2316}
            height={1262}
            sizes="(max-width: 1680px) 100vw, 1680px"
          />
        </PixelLens>
      </figure>

      <p className={styles.location}>
        {t.location}
      </p>
    </div>
  );
}
