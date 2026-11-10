import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Login do /admin: uma senha só, guardada em ADMIN_PASSWORD (variável de
 * ambiente na Vercel e no .env.local). Ao entrar, o navegador recebe um
 * cookie assinado com essa senha; trocar a senha derruba todas as sessões.
 */

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

function secret(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password ? `olho-negro-admin:${password}` : null;
}

function sign(value: string, key: string): string {
  return createHmac("sha256", key).update(value).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkPassword(attempt: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  // Compara os hashes para não vazar o tamanho da senha pelo tempo de resposta.
  return safeEqual(sign(attempt, "check"), sign(password, "check"));
}

export async function startSession(): Promise<void> {
  const key = secret();
  if (!key) return;
  const expires = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires, key)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const key = secret();
  if (!key) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires, key));
}
