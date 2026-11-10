"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, isAdmin, startSession } from "@/lib/admin-auth";
import { CONTENT_TAG, blobConfigured, writeContent } from "@/lib/content-store";
import type { SiteContent } from "@/lib/content-types";

export async function login(_state: string | null, formData: FormData): Promise<string | null> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return "Senha incorreta.";
  await startSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin");
}

export async function saveContent(content: SiteContent): Promise<{ ok: boolean; error?: string; savedAt?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "Sessão expirada. Entre de novo." };
  if (!blobConfigured()) return { ok: false, error: "Armazenamento (Vercel Blob) não configurado." };
  if (content?.version !== 1 || !Array.isArray(content.projects) || !Array.isArray(content.art)) {
    return { ok: false, error: "Conteúdo inválido." };
  }

  const savedAt = new Date().toISOString();
  try {
    await writeContent({ ...content, updatedAt: savedAt });
  } catch (error) {
    console.error("CMS: falha ao salvar", error);
    return { ok: false, error: "Não foi possível salvar. Tente de novo." };
  }

  // O site inteiro passa a mostrar o conteúdo novo na próxima visita.
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  return { ok: true, savedAt };
}
