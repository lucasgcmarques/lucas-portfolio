import type { NextRequest } from "next/server";
import { notionConfigured, notionRequest } from "@/lib/notion/client";
import { getFiles } from "@/lib/notion/properties";
import type { BlockData, NotionBlock, NotionFile, NotionPage } from "@/lib/notion/types";

/**
 * Redireciona para o link atual de um arquivo enviado ao Notion.
 * Os links do Notion expiram em 1 hora; cache de 25 min aqui + 25 min na CDN
 * garante que o visitante sempre recebe um link válido.
 */
const CACHE_SECONDS = 1500;

const ID_PATTERN = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;

function fileUrl(file: NotionFile | null | undefined): string | null {
  if (!file) return null;
  return file.type === "file" ? file.file.url : file.external.url;
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!notionConfigured() || !ID_PATTERN.test(id)) {
    return new Response("Arquivo não encontrado.", { status: 404 });
  }

  const params = request.nextUrl.searchParams;
  const source = params.get("src") ?? "block";
  let url: string | null = null;

  try {
    if (source === "block") {
      const block = await notionRequest<NotionBlock>(`/blocks/${id}`, { revalidate: CACHE_SECONDS });
      const data = block[block.type] as BlockData | undefined;
      url = data?.type === "file" ? data.file?.url ?? null : data?.external?.url ?? null;
    } else {
      const page = await notionRequest<NotionPage>(`/pages/${id}`, { revalidate: CACHE_SECONDS });
      if (source === "cover") {
        url = fileUrl(page.cover);
      } else if (source === "property") {
        const files = getFiles(page.properties, params.get("prop") ?? "");
        url = fileUrl(files[Number(params.get("i") ?? 0)]);
      }
    }
  } catch (error) {
    console.error("[media]", error);
    return new Response("Não foi possível buscar o arquivo no Notion.", { status: 502 });
  }

  if (!url) return new Response("Arquivo não encontrado.", { status: 404 });

  return new Response(null, {
    status: 307,
    headers: {
      Location: url,
      "Cache-Control": `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`,
    },
  });
}
