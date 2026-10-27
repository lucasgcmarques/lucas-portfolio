import type { Metadata } from "next";
import { CopyEmail } from "@/components/CopyEmail";
import { site } from "@/lib/site";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com ${site.person} (VJ Olho Negro) sobre shows, festivais, turnês, instalações e conteúdo visual.`,
};

export default function ContactPage() {
  const channels = [
    { label: "Instagram", value: site.contact.instagram.handle, url: site.contact.instagram.url },
    { label: "WhatsApp", value: site.contact.phoneDisplay, url: site.contact.whatsapp },
    ...site.contact.others.map((channel) => ({ label: channel.label, value: channel.url.replace(/^https?:\/\/(www\.)?/, ""), url: channel.url })),
  ];

  return (
    <div className="container">
      <h1 className="page-title">Contato</h1>

      <section className={styles.primary} aria-labelledby="email-label">
        <p id="email-label" className={styles.hint}>
          Para orçamentos, mande a data, a cidade, o tipo de evento e o que você imagina para os visuais.
        </p>
        <a className={styles.email} href={`mailto:${site.contact.email}`}>
          {site.contact.email}
        </a>
        <div className={styles.copy}>
          <CopyEmail email={site.contact.email} />
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

      <p className={styles.location}>
        Baseado em {site.city}. Disponível para trabalhos no Brasil e no exterior.
      </p>
    </div>
  );
}
