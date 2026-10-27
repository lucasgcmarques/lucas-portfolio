import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

/**
 * Atualiza o site na hora, sem esperar o cache de 10 minutos.
 * Abra /api/revalidate?secret=SEU_SEGREDO no navegador depois de editar o Notion.
 */
async function handle(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const given = request.nextUrl.searchParams.get("secret") ?? request.headers.get("x-revalidate-secret");

  if (!secret) {
    return Response.json({ ok: false, error: "Defina REVALIDATE_SECRET nas variáveis de ambiente." }, { status: 500 });
  }
  if (given !== secret) {
    return Response.json({ ok: false, error: "Segredo inválido." }, { status: 401 });
  }

  revalidatePath("/", "layout");
  return Response.json({ ok: true, revalidated: new Date().toISOString() });
}

export const GET = handle;
export const POST = handle;
