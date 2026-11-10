import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { buildSeedContent } from "@/lib/content-seed";
import { blobConfigured, getContentFresh } from "@/lib/content-store";
import { AdminEditor } from "./AdminEditor";
import { LoginForm } from "./LoginForm";
import styles from "./admin.module.css";

// Depende do cookie de login e sempre mostra a versão mais nova do conteúdo.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <main className={styles.center}>
        <div className={styles.card}>
          <h1 className={styles.cardTitle}>CMS</h1>
          <p className={styles.muted}>
            Defina a variável <code>ADMIN_PASSWORD</code> (na Vercel e no <code>.env.local</code>) para liberar o login.
          </p>
        </div>
      </main>
    );
  }

  if (!(await isAdmin())) return <LoginForm />;

  const saved = await getContentFresh();
  const content = saved ?? (await buildSeedContent());
  return <AdminEditor initial={content} firstSave={!saved} blobReady={blobConfigured()} />;
}
