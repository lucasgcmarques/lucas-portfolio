/**
 * Cliente HTTP mínimo para a API do Notion.
 * Usa fetch direto (sem SDK) para aproveitar o cache de dados do Next.js.
 */

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

/** Tempo (s) que o conteúdo do Notion fica em cache antes de ser buscado de novo. */
export const REVALIDATE_SECONDS = 600;

/** Tag usada pela rota /api/revalidate para limpar o cache do Notion. */
export const NOTION_CACHE_TAG = "notion";

export function notionConfigured(): boolean {
  return Boolean(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID);
}

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  /** Sobrescreve REVALIDATE_SECONDS para esta chamada. */
  revalidate?: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function notionRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("NOTION_TOKEN não está configurado.");

  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const response = await fetch(`${NOTION_API}${path}`, {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      next: {
        revalidate: options.revalidate ?? REVALIDATE_SECONDS,
        tags: [NOTION_CACHE_TAG],
      },
    });

    // Limite de 3 requisições/segundo: espera e tenta de novo.
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxAttempts) break;
      const retryAfter = Number(response.headers.get("retry-after"));
      await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 500 * attempt);
      continue;
    }

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Notion respondeu ${response.status} em ${path}: ${detail}`);
    }

    return (await response.json()) as T;
  }

  throw new Error(`Notion não respondeu em ${path} depois de ${maxAttempts} tentativas.`);
}

/** Executa tarefas com no máximo `limit` em paralelo (respeita o limite da API). */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  task: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await task(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
