import "server-only";
import { del, list, put } from "@vercel/blob";
import { unstable_cache } from "next/cache";
import type { SiteContent } from "./content-types";

/**
 * Leitura e gravação do conteúdo do CMS no Vercel Blob.
 *
 * Cada salvamento grava content/site-<data>.json (nunca sobrescreve) e o
 * site lê sempre o mais recente. As versões anteriores ficam como histórico
 * e as mais antigas que KEEP são apagadas.
 */

const PREFIX = "content/site-";
const KEEP = 30;
export const CONTENT_TAG = "content";

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function listVersions() {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  return blobs.sort((a, b) => b.pathname.localeCompare(a.pathname));
}

async function readLatest(): Promise<SiteContent | null> {
  if (!blobConfigured()) return null;
  try {
    const [latest] = await listVersions();
    if (!latest) return null;
    // O arquivo nunca muda depois de gravado, então pode vir do cache da CDN.
    const response = await fetch(latest.url, { cache: "force-cache" });
    if (!response.ok) return null;
    return (await response.json()) as SiteContent;
  } catch (error) {
    console.error("CMS: não foi possível ler o conteúdo", error);
    return null;
  }
}

/** Conteúdo publicado pelo CMS, ou null enquanto nada foi salvo. */
export const getContent = unstable_cache(readLatest, ["site-content"], {
  tags: [CONTENT_TAG],
  revalidate: 3600,
});

/** Sem cache: usado pelo /admin para sempre editar a versão mais nova. */
export const getContentFresh = readLatest;

export async function writeContent(content: SiteContent): Promise<void> {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await put(`${PREFIX}${stamp}.json`, JSON.stringify(content), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    cacheControlMaxAge: 31536000,
  });
  const versions = await listVersions();
  const old = versions.slice(KEEP).map((blob) => blob.url);
  if (old.length > 0) await del(old);
}
