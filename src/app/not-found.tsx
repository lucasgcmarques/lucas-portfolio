import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <h1 className="page-title">Sem sinal</h1>
      <p style={{ maxWidth: "48ch", color: "var(--ash)" }}>
        Esta página não existe ou o projeto saiu do ar. Veja todos os trabalhos no{" "}
        <Link href="/portfolio" style={{ color: "var(--bone)" }}>
          portfólio
        </Link>
        .
      </p>
    </div>
  );
}
