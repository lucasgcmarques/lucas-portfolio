/** Tipos mínimos da API do Notion usados pelo site (versão 2022-06-28). */

export type RichText = {
  type: "text" | "mention" | "equation";
  plain_text: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
};

export type NotionFile =
  | { type: "file"; name?: string; file: { url: string; expiry_time?: string } }
  | { type: "external"; name?: string; external: { url: string } };

export type Property = { id: string; type: string } & Record<string, unknown>;

export type NotionPage = {
  object: "page";
  id: string;
  url: string;
  cover: NotionFile | null;
  properties: Record<string, Property>;
  last_edited_time: string;
};

export type QueryResponse = {
  results: NotionPage[];
  has_more: boolean;
  next_cursor: string | null;
};

/** Campos que os blocos usados pelo site podem ter dentro de block[block.type]. */
export type BlockData = {
  rich_text?: RichText[];
  caption?: RichText[];
  url?: string;
  type?: "file" | "external";
  file?: { url: string };
  external?: { url: string };
  name?: string;
  language?: string;
  icon?: { type: "emoji"; emoji: string } | { type: string } | null;
  is_toggleable?: boolean;
};

export type NotionBlock = {
  object: "block";
  id: string;
  type: string;
  has_children: boolean;
  children?: NotionBlock[];
} & Record<string, unknown>;

export type BlockChildrenResponse = {
  results: NotionBlock[];
  has_more: boolean;
  next_cursor: string | null;
};
