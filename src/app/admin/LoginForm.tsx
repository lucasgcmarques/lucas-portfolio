"use client";

import { useActionState } from "react";
import { login } from "./actions";
import styles from "./admin.module.css";

export function LoginForm() {
  const [error, action, pending] = useActionState(login, null);

  return (
    <main className={styles.center}>
      <form action={action} className={styles.card}>
        <h1 className={styles.cardTitle}>CMS</h1>
        <label className={styles.field}>
          <span>Senha</span>
          <input type="password" name="password" autoComplete="current-password" required autoFocus />
        </label>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className={styles.primary} disabled={pending}>
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
