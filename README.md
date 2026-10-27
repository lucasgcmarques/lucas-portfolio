# VJ Olho Negro — portfólio

Site de portfólio do Lucas Guimarães (VJ Olho Negro), feito em Next.js. Os projetos vêm do database **VJ Projects** no Notion: edite no Notion e o site se atualiza sozinho em até 10 minutos.

## Páginas

| Endereço | Conteúdo |
| --- | --- |
| `/` | Marca OLHO NEGRO com o trabalho passando por dentro das letras, apresentação, projetos em destaque e palcos/artistas |
| `/portfolio` | Grade com todos os projetos e filtro por categoria |
| `/portfolio/[projeto]` | Página de cada projeto: descrição, data, local, capa e todo o conteúdo da página do Notion (texto, fotos, vídeos do YouTube/Vimeo/Drive, colunas) |
| `/sobre` | Biografia, ferramentas, formação e trajetória por ano (gerada a partir dos projetos) |
| `/contato` | E-mail, Instagram e WhatsApp |

## Configurar o Notion (uma vez)

1. Acesse https://www.notion.so/profile/integrations e crie uma **integração interna** (nome sugerido: "Site Olho Negro"), com permissão só de leitura de conteúdo.
2. Copie o **Internal Integration Secret** (começa com `ntn_`).
3. No Notion, abra a página **VJ Olho Negro**, clique em `•••` → **Conexões** → adicione a integração. Isso dá acesso ao database VJ Projects e às páginas dentro dela.

### Colunas do database VJ Projects

Já existentes e usadas pelo site: `Name`, `Descrição`, `Categoria`, `Data`, `Local`.

Opcionais — crie se quiser usar (os nomes precisam ser exatamente estes):

| Coluna | Tipo | Para que serve |
| --- | --- | --- |
| `Capa` | Arquivos e mídia | Imagem ou vídeo (.mp4) de capa. Um vídeo de capa num projeto em destaque vira o vídeo da Home. |
| `Destaque` | Caixa de seleção | Projetos marcados aparecem na Home (até 5). |
| `Tags` | Seleção múltipla | Ex.: 3D, Motion, TouchDesigner. |
| `Vídeo` | URL | Vídeo principal do projeto (YouTube, Vimeo, Drive ou .mp4). |
| `Publicado` | Caixa de seleção | Se a coluna existir, só os marcados aparecem no site. |
| `Slug` | Texto | Endereço personalizado, ex. `rock-in-rio-2026`. |

Sem capa, o site usa a capa da página do Notion ou a primeira foto/vídeo do conteúdo. Sem nenhuma mídia, mostra uma placa com o ano.

As categorias **Desenvolvimento** e **Educação** ficam fora do portfólio. Para mudar, edite `hiddenCategories` em `src/lib/site.ts`.

## Variáveis de ambiente (Vercel → Settings → Environment Variables)

| Variável | Obrigatória | Valor |
| --- | --- | --- |
| `NOTION_TOKEN` | sim | o secret da integração |
| `NOTION_DATABASE_ID` | sim | `9fa47e7d33e34a2b8664977942a65bf7` |
| `REVALIDATE_SECRET` | recomendada | qualquer senha longa |
| `HERO_VIDEO_URL` | não | link direto de um .mp4/.webm para a Home |
| `NOTION_ABOUT_PAGE_ID` | não | ID de uma página do Notion para substituir a biografia |
| `NEXT_PUBLIC_SITE_URL` | não | domínio final, ex. `https://olhonegro.com` |

Sem `NOTION_TOKEN` o site mostra um conteúdo de exemplo (útil para desenvolvimento).

## Atualizar na hora

O cache dura 10 minutos. Para ver uma mudança imediatamente, abra:

```
https://SEU-SITE/api/revalidate?secret=SEU_REVALIDATE_SECRET
```

## Textos fixos

Bio, ferramentas, formação, lista de palcos e artistas e contatos ficam em `src/lib/site.ts`.

## Desenvolvimento local

```bash
cp .env.example .env.local   # preencha NOTION_TOKEN
npm install
npm run dev
```

## Estrutura

```
src/
  app/                 páginas (App Router) e rotas de API
    api/media/[id]     entrega arquivos do Notion com link sempre válido
    api/revalidate     limpa o cache sob demanda
  components/          header, footer, cards, grade, hero, renderer do Notion
  lib/
    notion/            cliente da API, tipos e leitura das colunas
    projects.ts        busca e monta os projetos
    site.ts            textos e contatos fixos
  fonts/               Anybody e Atkinson Hyperlegible Next (licença OFL)
```

Os arquivos enviados ao Notion têm links que expiram em 1 hora; por isso as imagens passam por `/api/media`, que sempre busca um link novo.
