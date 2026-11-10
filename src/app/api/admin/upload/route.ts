import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

/**
 * Libera o envio direto do navegador para o Vercel Blob (imagens e vídeos),
 * só para quem está logado no /admin. O arquivo não passa pelo servidor do
 * site, então vídeos grandes também funcionam.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await isAdmin())) throw new Error("Não autorizado");
        return {
          allowedContentTypes: ["image/*", "video/*"],
          maximumSizeInBytes: 500 * 1024 * 1024,
          addRandomSuffix: true,
          cacheControlMaxAge: 31536000,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro no envio";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
