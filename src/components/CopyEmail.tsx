"use client";

import { useState } from "react";
import styles from "./CopyEmail.module.css";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button type="button" className={styles.button} onClick={copy}>
      <span aria-live="polite">{copied ? "E-mail copiado" : "Copiar e-mail"}</span>
    </button>
  );
}
