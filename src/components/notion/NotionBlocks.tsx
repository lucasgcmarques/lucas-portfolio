import type { ReactNode } from "react";
import { parseVideo } from "@/lib/media";
import { plainText } from "@/lib/notion/properties";
import type { BlockData, NotionBlock } from "@/lib/notion/types";
import { proxiedMediaUrl } from "@/lib/projects";
import { RichText } from "./RichText";
import { VideoEmbed } from "./VideoEmbed";
import styles from "./NotionBlocks.module.css";

/**
 * Renderiza o conteúdo de uma página do Notion.
 * Blocos suportados: texto, títulos, listas, citação, destaque, divisor,
 * imagem, vídeo, embed, arquivo, link, colunas, toggle e código.
 */
export function NotionBlocks({ blocks }: { blocks: NotionBlock[] }) {
  return <div className={styles.content}>{renderBlocks(blocks)}</div>;
}

function dataOf(block: NotionBlock): BlockData {
  return (block[block.type] as BlockData | undefined) ?? {};
}

function fileSrc(block: NotionBlock, data: BlockData): string | null {
  if (data.type === "external") return data.external?.url ?? null;
  if (data.type === "file") return proxiedMediaUrl(block.id, "block");
  return null;
}

/** Junta itens de lista consecutivos em <ul>/<ol>. */
function renderBlocks(blocks: NotionBlock[]): ReactNode[] {
  const output: ReactNode[] = [];
  let index = 0;

  while (index < blocks.length) {
    const block = blocks[index];

    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const type = block.type;
      const items: NotionBlock[] = [];
      while (index < blocks.length && blocks[index].type === type) {
        items.push(blocks[index]);
        index++;
      }
      const List = type === "bulleted_list_item" ? "ul" : "ol";
      output.push(
        <List key={items[0].id} className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
              <RichText parts={dataOf(item).rich_text} />
              {item.children?.length ? renderBlocks(item.children) : null}
            </li>
          ))}
        </List>,
      );
      continue;
    }

    output.push(<Block key={block.id} block={block} />);
    index++;
  }

  return output;
}

function Caption({ data }: { data: BlockData }) {
  if (!data.caption?.length) return null;
  return (
    <figcaption className={styles.caption}>
      <RichText parts={data.caption} />
    </figcaption>
  );
}

function Block({ block }: { block: NotionBlock }) {
  const data = dataOf(block);
  const children = block.children?.length ? renderBlocks(block.children) : null;

  switch (block.type) {
    case "paragraph":
      if (!data.rich_text?.length) return null;
      return (
        <p className={styles.paragraph}>
          <RichText parts={data.rich_text} />
        </p>
      );

    case "heading_1":
    case "heading_2":
    case "heading_3": {
      const Tag = block.type === "heading_3" ? "h4" : block.type === "heading_2" ? "h3" : "h2";
      const heading = (
        <Tag className={styles[block.type]}>
          <RichText parts={data.rich_text} />
        </Tag>
      );
      if (data.is_toggleable && children) {
        return (
          <details className={styles.toggle}>
            <summary>{heading}</summary>
            {children}
          </details>
        );
      }
      return heading;
    }

    case "quote":
      return (
        <blockquote className={styles.quote}>
          <RichText parts={data.rich_text} />
          {children}
        </blockquote>
      );

    case "callout":
      return (
        <aside className={styles.callout}>
          <RichText parts={data.rich_text} />
          {children}
        </aside>
      );

    case "divider":
      return <hr className={styles.divider} />;

    case "toggle":
      return (
        <details className={styles.toggle}>
          <summary>
            <RichText parts={data.rich_text} />
          </summary>
          {children}
        </details>
      );

    case "code":
      return (
        <pre className={styles.code}>
          <code>{plainText(data.rich_text)}</code>
        </pre>
      );

    case "image": {
      const src = fileSrc(block, data);
      if (!src) return null;
      const alt = plainText(data.caption) || "";
      return (
        <figure className={styles.wide}>
          {/* eslint-disable-next-line @next/next/no-img-element -- links dinâmicos do Notion */}
          <img className={styles.image} src={src} alt={alt} loading="lazy" decoding="async" />
          <Caption data={data} />
        </figure>
      );
    }

    case "video":
    case "embed": {
      const url = block.type === "embed" ? data.url : data.type === "external" ? data.external?.url : null;
      const video = data.type === "file" ? { provider: "file" as const, src: proxiedMediaUrl(block.id, "block") } : parseVideo(url);
      const title = plainText(data.caption) || "Vídeo do projeto";
      if (video) {
        return (
          <figure className={styles.wide}>
            <VideoEmbed video={video} title={title} />
            <Caption data={data} />
          </figure>
        );
      }
      if (!url) return null;
      return <LinkLine url={url} label={plainText(data.caption)} />;
    }

    case "file":
    case "pdf": {
      const src = fileSrc(block, data);
      if (!src) return null;
      return <LinkLine url={src} label={data.name || plainText(data.caption) || "Baixar arquivo"} />;
    }

    case "bookmark":
    case "link_preview":
      return data.url ? <LinkLine url={data.url} label={plainText(data.caption)} /> : null;

    case "column_list":
      return (
        <div className={`${styles.columns} ${styles.wide}`}>
          {(block.children ?? []).map((column) => (
            <div key={column.id} className={styles.column}>
              {column.children?.length ? renderBlocks(column.children) : null}
            </div>
          ))}
        </div>
      );

    case "synced_block":
      return <>{children}</>;

    default:
      return null;
  }
}

function LinkLine({ url, label }: { url: string; label?: string }) {
  let host = url;
  try {
    host = new URL(url, "https://example.com").hostname.replace(/^www\./, "");
  } catch {
    // mantém o texto original
  }
  return (
    <p className={styles.linkLine}>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {label || host}
      </a>
    </p>
  );
}
