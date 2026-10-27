/** Reconhece links de vídeo (YouTube, Vimeo, Google Drive, arquivos) e monta embeds. */

export type VideoSource =
  | { provider: "youtube"; id: string; embedUrl: string; thumbnail: string }
  | { provider: "vimeo"; id: string; embedUrl: string; pageUrl: string }
  | { provider: "drive"; id: string; embedUrl: string; thumbnail: string }
  | { provider: "file"; src: string };

const VIDEO_FILE = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
const IMAGE_FILE = /\.(jpe?g|png|gif|webp|avif|svg)(\?|#|$)/i;

export function isVideoFileName(name: string | undefined | null): boolean {
  return Boolean(name && VIDEO_FILE.test(name));
}

export function isImageFileName(name: string | undefined | null): boolean {
  return Boolean(name && IMAGE_FILE.test(name));
}

function safeUrl(raw: string): URL | null {
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

export function parseVideo(raw: string | null | undefined): VideoSource | null {
  if (!raw) return null;
  const url = safeUrl(raw.trim());
  if (!url) return null;
  const host = url.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtube.com" || host === "youtu.be" || host === "youtube-nocookie.com") {
    let id: string | null = null;
    if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
    else if (url.pathname === "/watch") id = url.searchParams.get("v");
    else {
      const match = url.pathname.match(/^\/(embed|shorts|live|v)\/([^/?#]+)/);
      id = match ? match[2] : null;
    }
    if (!id || !/^[\w-]{6,}$/.test(id)) return null;
    return {
      provider: "youtube",
      id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const index = parts.findIndex((part) => /^\d+$/.test(part));
    if (index === -1) return null;
    const id = parts[index];
    // Links privados do Vimeo trazem um hash depois do ID (vimeo.com/123/abc) ou em ?h=
    const hash = url.searchParams.get("h") ?? (parts[index + 1] && /^[\da-f]+$/i.test(parts[index + 1]) ? parts[index + 1] : null);
    const params = new URLSearchParams({ title: "0", byline: "0", portrait: "0", dnt: "1" });
    if (hash) params.set("h", hash);
    return {
      provider: "vimeo",
      id,
      embedUrl: `https://player.vimeo.com/video/${id}?${params.toString()}`,
      pageUrl: hash ? `https://vimeo.com/${id}/${hash}` : `https://vimeo.com/${id}`,
    };
  }

  if (host === "drive.google.com") {
    const match = url.pathname.match(/\/file\/d\/([^/]+)/);
    const id = match ? match[1] : url.searchParams.get("id");
    if (!id) return null;
    return {
      provider: "drive",
      id,
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      thumbnail: `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
    };
  }

  if (VIDEO_FILE.test(url.pathname)) return { provider: "file", src: url.toString() };
  return null;
}

/** Miniatura de um vídeo do Vimeo pela API pública de oEmbed (resultado em cache por 1 dia). */
export async function vimeoThumbnail(pageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://vimeo.com/api/oembed.json?width=1280&url=${encodeURIComponent(pageUrl)}`,
      { next: { revalidate: 86400 } },
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { thumbnail_url?: string };
    return data.thumbnail_url ?? null;
  } catch {
    return null;
  }
}
