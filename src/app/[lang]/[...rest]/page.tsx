import { notFound } from "next/navigation";

// Qualquer caminho que não existe cai aqui e mostra o not-found do idioma.
export default function CatchAll() {
  notFound();
}
