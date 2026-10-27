import type { ReactNode } from "react";
import type { RichText as RichTextPart } from "@/lib/notion/types";

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

/** Converte links internos do Notion (notion.so/…) em texto simples para não levar o visitante ao Notion. */
function usableHref(href: string | null): string | null {
  if (!href) return null;
  if (/notion\.(so|site|com)\//.test(href) || href.startsWith("/")) return null;
  return href;
}

export function RichText({ parts }: { parts: RichTextPart[] | undefined }) {
  if (!parts || parts.length === 0) return null;

  return (
    <>
      {parts.map((part, index) => {
        const { bold, italic, strikethrough, underline, code } = part.annotations;
        let node: ReactNode = part.plain_text;
        if (code) node = <code>{node}</code>;
        if (bold) node = <strong>{node}</strong>;
        if (italic) node = <em>{node}</em>;
        if (strikethrough) node = <s>{node}</s>;
        if (underline) node = <u>{node}</u>;

        const href = usableHref(part.href);
        if (href) {
          node = (
            <a href={href} {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {node}
            </a>
          );
        }
        return <span key={index}>{node}</span>;
      })}
    </>
  );
}
