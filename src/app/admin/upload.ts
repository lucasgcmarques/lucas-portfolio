"use client";

import { upload } from "@vercel/blob/client";

/**
 * Envia um arquivo do computador direto para o Vercel Blob.
 * Fotos grandes são reduzidas no navegador antes (lado maior com até 2400 px,
 * em WebP, que mantém transparência); vídeos vão como estão, em partes.
 */

const MAX_SIDE = 2400;

function safeName(name: string): string {
  return (
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "arquivo"
  );
}

async function shrinkImage(file: File): Promise<Blob | null> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return null;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size < 600 * 1024) return null;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.86));
  return blob && blob.size < file.size ? blob : null;
}

export async function uploadMedia(
  file: File,
  onProgress?: (percentage: number) => void,
): Promise<{ url: string; kind: "image" | "video" }> {
  const kind = file.type.startsWith("video/") ? "video" : "image";
  const folder = kind === "video" ? "videos" : "imagens";
  const small = kind === "image" ? await shrinkImage(file) : null;
  const body = small ?? file;
  const extension = small ? "webp" : (file.name.split(".").pop() ?? "bin").toLowerCase();

  const result = await upload(`midia/${folder}/${safeName(file.name)}.${extension}`, body, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
    contentType: small ? "image/webp" : file.type || undefined,
    multipart: body.size > 20 * 1024 * 1024,
    onUploadProgress: ({ percentage }) => onProgress?.(percentage),
  });
  return { url: result.url, kind };
}
