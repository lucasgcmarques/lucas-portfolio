import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "CMS · VJ Olho Negro",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
