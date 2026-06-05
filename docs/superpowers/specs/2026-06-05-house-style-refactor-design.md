# shck.dev — html-report house-style refactor · design spec

**Date:** 2026-06-05 · **Status:** approved (direction C "editorial hybrid" + full notion-mcp restore)
**Reference kit:** `/Users/shck/projects/rjf-auto-apply-microservice/.claude/skills/html-report/` (SKILL.md + skeleton.html)
**Approved mockups:** `.superpowers/brainstorm/98000-1780633477/content/design-preview.html` (gitignored; this doc is the durable record)

## 1. Context

shck.dev is an Astro 6 static blog (posts collection + release-fed changelog) currently styled
as a dark terminal theme (bg `#0a0a0a`, teal accent `#5eead4`, SF Mono, 720px, blinking-cursor
hero). The refactor converges it on the html-report house style: light paper, JetBrains Mono,
hairline/heavy rule hierarchy, editorial restraint. **Converge, don't create** — the design
questions are answered by the kit; this spec adapts the kit's furniture to a site (multi-page,
content collections) rather than a single report file.

Separately, the pre-blog shck.dev hosted `/blog/notion-mcp`, a URL published in the
`@shck-dev/notion-mcp` npm README and now a 404. This refactor restores it: notion-mcp becomes
a first-class TOOLS entry, gets a fresh post at `/posts/notion-mcp/`, and `/blog/notion-mcp`
redirects there.

## 2. Decisions (locked)

| # | Decision | Choice |
|---|----------|--------|
| D1 | Refactor depth | **C — editorial hybrid**: report bones (left h1 + dim qualifier, stats band, heavy/hairline rules, tabular dates) with list-shaped content, not full tables |
| D2 | Brand accent | one accent: indigo `#4f46e5` on the `.dev` of the brand |
| D3 | Per-tool series accents | by TOOLS order from the house set: ccx `#4f46e5`, notion-mcp `#7c3aed` (next: `#0d9488`, `#b45309`) |
| D4 | notion-mcp | **full restore**: TOOLS entry + new post `/posts/notion-mcp/` + redirect `/blog/notion-mcp → /posts/notion-mcp/` (plus `/blog → /posts/`) |
| D5 | What dies | dark theme, teal accent, blinking cursor animation, centered hero, letter-spacing display type, radius >2px |
| D6 | Shell | 720px → **1060px**; prose self-caps at 94ch |
| D7 | Dates | `YYYY-MM-DD` everywhere, `tabular-nums`, right-aligned |

## 3. Visual system (the contract)

### 3.1 Tokens

```css
:root {
  --bg: #fcfcfc;        /* paper */
  --fg: #0a0a0a;        /* ink */
  --muted: #6b6b6b;     /* the one gray */
  --rule: #e5e5e5;      /* hairline */
  --hover: #f6f6f6;
  --underline: #cdcdd3; /* link underline tint */
  --brand: #4f46e5;     /* indigo — the one brand accent */
}
```

### 3.2 Type

`'JetBrains Mono', ui-monospace, Menlo, monospace` for everything, loaded via Google Fonts
(weights 400;500;700, `display=swap`, with preconnect). Scale: base **13px/1.5** · h1 **15px/700**
(+ `.dim` qualifier in muted 400) · h2 **13px/700** with hairline underline · meta/source lines
**11px** · data/right columns **12px** · stats **12.5px**. Prose line-height 1.7.

### 3.3 Hierarchy by rules, not boxes

Heavy `1px solid var(--fg)` top-rules anchor the **stats band**, the **footer**, and (matching
the kit's table idiom) **table header rows** in prose. Hairlines (`var(--rule)`) everywhere
else: nav bottom, h2 underline, row separators, pre borders. No shadows, no gradients, no animation, radius ≤2px. Emphasis inside
muted text = `<b>` in ink.

### 3.4 Links

Body links: ink, underlined with `text-decoration-color: var(--underline)`,
`text-underline-offset: 3px`; hover darkens the underline to ink. Nav links: muted 11px, no
underline, hover → ink. Tool-name links: bold in the tool's accent, no underline, hover
underline. Footer links: ink 500, no underline, hover underline.

### 3.5 Alignment fix (rules must align)

Horizontal padding lives on `body` (`0 18px`; `0 14px` ≤640px), **not** on nav/main/footer —
so every rule (nav hairline, stats heavy rule, h2 underlines, row separators, footer heavy
rule) spans exactly the same 1060px column.

## 4. File-by-file implementation

### 4.1 `src/layouts/Base.astro`

**Head:** keep all existing meta/OG/canonical/RSS/sitemap/umami wiring unchanged; add the
Google Fonts trio before the favicon link:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
```

**Body markup:** nav and main unchanged in structure (brand keeps `shck<span>.dev</span>`).
Footer becomes a named slot with the © line as fallback, so pages can override it
(home appends the release-fed sentence; changelog replaces it with "How to read this"):

```astro
<footer>
  <slot name="foot">
    <span>© {new Date().getFullYear()} shck · <a href="https://github.com/ofcRS">github</a> · <a href="/rss.xml">rss</a></span>
  </slot>
</footer>
```

**Global stylesheet** — replace the entire `<style is:global>` block with exactly this
(this is the house contract; pages rely on these class names):

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
:root {
  --bg: #fcfcfc;
  --fg: #0a0a0a;
  --muted: #6b6b6b;
  --rule: #e5e5e5;
  --hover: #f6f6f6;
  --underline: #cdcdd3;
  --brand: #4f46e5;
}
html { scrollbar-gutter: stable; }
body {
  font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace;
  background: var(--bg);
  color: var(--fg);
  font-size: 13px;
  line-height: 1.5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 18px;
}
nav {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  max-width: 1060px;
  width: 100%;
  margin: 0 auto;
  padding: 26px 0 10px;
  border-bottom: 1px solid var(--rule);
}
nav .brand { font-weight: 700; font-size: 13px; color: var(--fg); text-decoration: none; }
nav .brand span { color: var(--brand); }
nav .links a { color: var(--muted); text-decoration: none; margin-left: 18px; font-size: 11px; letter-spacing: 0.02em; }
nav .links a:hover { color: var(--fg); }
main { flex: 1; max-width: 1060px; width: 100%; margin: 0 auto; padding-bottom: 24px; }
footer {
  max-width: 1060px;
  width: 100%;
  margin: 56px auto 0;
  padding: 13px 0 44px;
  border-top: 1px solid var(--fg);
  font-size: 11px;
  color: var(--muted);
  line-height: 1.7;
}
footer b { color: var(--fg); font-weight: 500; }
footer a { color: var(--fg); font-weight: 500; text-decoration: none; }
footer a:hover { text-decoration: underline; }
a { color: var(--fg); text-decoration: underline; text-decoration-color: var(--underline); text-underline-offset: 3px; }
a:hover { text-decoration-color: var(--fg); }
h1 { font-size: 15px; font-weight: 700; margin: 30px 0 8px; letter-spacing: -0.01em; }
h1 .dim { color: var(--muted); font-weight: 400; }
h2 { font-size: 13px; font-weight: 700; margin: 42px 0 4px; padding-bottom: 5px; border-bottom: 1px solid var(--rule); }
h3 { font-size: 13px; font-weight: 700; margin: 24px 0 4px; }
p, ul, ol { margin: 0 0 14px; }
ul, ol { padding-left: 22px; }
code { background: #f1f1f1; padding: 1px 5px; border-radius: 2px; font-size: 12px; }
pre {
  background: #f6f6f6 !important;
  border: 1px solid var(--rule);
  border-radius: 2px;
  padding: 13px 15px;
  overflow-x: auto;
  margin: 0 0 14px;
  font-size: 12px;
  line-height: 1.6;
}
pre code { background: none; padding: 0; font-size: inherit; }
blockquote { border-left: 2px solid var(--rule); padding-left: 14px; color: var(--muted); margin: 0 0 14px; }
hr { border: 0; border-top: 1px solid var(--rule); margin: 16px 0 20px; }
.intro { color: var(--muted); max-width: 94ch; margin: 0 0 18px; line-height: 1.6; }
.intro b { color: var(--fg); font-weight: 500; }
.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 28px;
  padding: 13px 0;
  border-top: 1px solid var(--fg);
  border-bottom: 1px solid var(--rule);
  margin: 0 0 6px;
  font-size: 12.5px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.stats b { color: var(--fg); font-weight: 700; }
.srcline { color: var(--muted); font-size: 11px; margin: 11px 0 0; }
.note { color: var(--muted); font-size: 12px; margin: 0 0 12px; }
.meta { color: var(--muted); font-size: 11px; margin: 0; }
.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  border-bottom: 1px solid var(--rule);
  padding: 8px 0;
}
.row .right { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; white-space: nowrap; }
.row .blurb { color: var(--muted); }
.prose { max-width: 94ch; line-height: 1.7; }
.prose h2 { margin-top: 34px; }
.prose li { margin: 3px 0; }
.prose img { max-width: 100%; }
.prose table { border-collapse: collapse; font-size: 12px; margin: 0 0 14px; }
.prose th { text-align: left; border-bottom: 1px solid var(--fg); padding: 5px 16px 5px 0; }
.prose td { border-bottom: 1px solid var(--rule); padding: 5px 16px 5px 0; vertical-align: top; }
.toolhead { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; }
.toolhead .repo { color: var(--muted); font-size: 11px; font-weight: 400; text-decoration: none; }
.toolhead .repo:hover { text-decoration: underline; }
.relbody { color: #3f3f46; font-size: 12px; line-height: 1.65; margin: 4px 0 0; }
.relbody p, .relbody ul, .relbody ol { margin: 4px 0; }
.relbody ul, .relbody ol { padding-left: 20px; }
.relbody h1, .relbody h2, .relbody h3 { font-size: 12px; margin: 8px 0 2px; padding: 0; border: 0; }
.relbody code { font-size: 11.5px; }
@media (max-width: 640px) {
  body { padding: 0 14px; }
  .stats { gap: 6px 18px; }
  .row { flex-wrap: wrap; }
}
```

Notes: `.toolhead`/`.relbody` are global (not scoped in changelog.astro) because release HTML
arrives via `set:html` and scoped selectors don't reach injected nodes. `pre` keeps the
`!important` background override (same trick the current dark theme uses) so shiki's inline
`background-color` yields to the house `#f6f6f6`.

### 4.2 `src/pages/index.astro`

Delete the hero (`.hero`, `.cursor`, `@keyframes blink`, `.tagline`) and the scoped dark styles.
New frontmatter computes, at build time:

- `posts`: non-draft, date-desc (keep), `slice(0, 5)`.
- Per-tool latest release: for each `TOOLS` entry, `getCollection(\`releases_${t.name}\` as any)`
  wrapped in try/catch (empty array on failure), normalized identically in both pages against
  the **@ascorbic/feed-loader v2 entry schema**: `title: d.title ?? e.id`,
  `url: d.url ?? <github releases fallback>`, `date: d.updated ?? d.published ?? null` (for
  GitHub releases.atom the date lives in `updated`; `published` is null), and — changelog
  only — `html: d.content ?? d.description ?? ''` (the release body lives in `content`).
  Legacy rss-parser keys (`pubdate`/`pubDate`/`link`/`summary`) do not exist on this schema.
  Sort date-desc; take `[0]`.
- `version(title)`: first match of `/v?(\d+\.\d+\.\d+)/` in the release title → display
  `v${m[1]}`; fall back to `'—'`.
- `latest`: across all tools' newest releases, the most recent by date → label
  `${tool.name} ${version}`.
- `buildDate = new Date().toISOString().slice(0, 10)`;
  `iso = (d: string | Date | null | undefined) => (d ? new Date(d).toISOString().slice(0, 10) : '')` —
  null-safe because release dates can be missing.

Markup (inside `<Base>`):

```astro
<h1>shck.dev <span class="dim">/ open-source developer tools</span></h1>
<p class="intro">Tools built in public — <b>release-fed changelogs</b>, write-ups when things ship.</p>
<div class="stats">
  <span><b>{TOOLS.length}</b> {TOOLS.length === 1 ? 'tool' : 'tools'}</span>
  <span><b>{postCount}</b> {postCount === 1 ? 'post' : 'posts'}</span>
  {latest && <span>latest: <b>{latest.label}</b></span>}
  <span>{buildDate}</span>
</div>
<p class="srcline">changelog compiled from GitHub releases at build time · nothing hand-maintained</p>

<h2>tools</h2>
<!-- per tool: -->
<div class="row">
  <span>
    <a class="tool" style={`color:${t.accent}`} href={`https://github.com/${t.repo}`}>{t.name}</a>
    <span class="blurb"> — {t.blurb}</span>
  </span>
  <span class="right">{toolVersion}</span>
</div>

<h2>writing</h2>
<!-- per post: -->
<div class="row">
  <a href={`/posts/${p.id}/`}>{p.data.title}</a>
  <span class="right">{iso(p.data.date)}</span>
</div>
<!-- if no posts: <p class="note">(no posts yet)</p> -->
<!-- if postCount > 5, one extra row linking "all posts →" to /posts/ -->

<span slot="foot">
  © {new Date().getFullYear()} shck · <a href="https://github.com/ofcRS">github</a> ·
  <a href="/rss.xml">rss</a> — changelog is release-fed; nothing hand-maintained.
</span>
```

`postCount` is the unsliced count. Scoped style: only
`.tool { font-weight: 700; text-decoration: none; } .tool:hover { text-decoration: underline; }`.

### 4.3 `src/pages/posts/index.astro`

```astro
<h1>writing <span class="dim">/ all posts, newest first</span></h1>
<!-- per post: same .row idiom as homepage, dates iso() -->
```

Drop `.post-list`/`time` markup; rows are `div.row` with the link + `.right` date. Keep
collection query; replace `fmt` with `iso`.

### 4.4 `src/pages/posts/[...slug].astro`

```astro
<article>
  <h1>{post.data.title}</h1>
  <p class="meta">{metaLine}</p>
  <hr />
  <div class="prose"><Content /></div>
</article>
```

`metaLine = [iso(date), ...(tool ? [tool] : []), ...tags.filter((x) => x !== tool)].join(' · ')`
— the tool name is not repeated when it's also a tag. Keep `getStaticPaths`, props, OG image
wiring unchanged.

### 4.5 `src/pages/changelog.astro`

Keep the normalization frontmatter's shape but fix its field names to the feed-loader v2
schema per §4.2 (the inherited `pubdate/pubDate/date/summary/link` keys never matched — they
silently dropped every release date and body), wrap each `getCollection` in try/catch → `[]`,
and add: per-tool latest, overall `latest` label and
`buildDate` (same helpers as 4.2 — duplicating ~10 lines across the two pages is fine; do
not invent a shared lib file).

```astro
<h1>changelog <span class="dim">/ release history</span></h1>
<p class="intro">Compiled from GitHub releases at build time — <b>always in sync</b>.</p>
<div class="stats">
  <span><b>{TOOLS.length}</b> {TOOLS.length === 1 ? 'tool' : 'tools'}</span>
  {latest && <span>latest: <b>{latest.label}</b></span>}
  <span>{buildDate}</span>
</div>

<!-- per tool: -->
<section>
  <h2 class="toolhead" style={`color:${tool.accent}`}>
    <span>{tool.name}</span>
    <a class="repo" href={`https://github.com/${tool.repo}`}>{tool.repo}</a>
  </h2>
  <p class="note">{tool.blurb}</p>
  <!-- per release: -->
  <div class="relrow">
    <div class="relhead">
      <a href={r.url}>{r.title}</a>
      <span class="right">{iso(r.date)}</span>
    </div>
    {r.html && <div class="relbody" set:html={r.html} />}
  </div>
  <!-- if none: <p class="note">(no releases yet)</p> -->
</section>

<span slot="foot">
  <b>How to read this:</b> every entry is a GitHub release, fetched from each repo's
  releases.atom at build time; a repository_dispatch rebuilds the page on release.
  Nothing here is hand-maintained.
</span>
```

Scoped style only for the row shell (selectors live on template-authored nodes, so scoping
works): `.relrow { border-bottom: 1px solid var(--rule); padding: 8px 0; }`,
`.relhead { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; }`,
`.relhead .right` inherits the global `.row .right` look — easiest is to reuse:
`.relhead .right { color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; white-space: nowrap; }`.
Keep page `title`/`description` props. Drop the old `.release` left-border idiom.

### 4.6 `astro.config.mjs`

```js
export default defineConfig({
  site: 'https://shck.dev',
  integrations: [sitemap()],
  redirects: {
    '/blog/notion-mcp': '/posts/notion-mcp/',
    '/blog': '/posts/',
  },
  markdown: { shikiConfig: { theme: 'github-light' } },
});
```

Static output → redirects emit meta-refresh HTML pages (`dist/blog/notion-mcp/index.html`),
which is exactly what the published npm-README link needs. Shiki goes light to match paper.

### 4.7 `src/site.config.ts`

`SITE` unchanged. Each tool gains an `accent` (house series colors, D3), and notion-mcp joins:

```ts
export const TOOLS = [
  {
    name: 'ccx',
    repo: 'ofcRS/ccx-context-system',
    accent: '#4f46e5',
    blurb: 'scratch-notebook context management for Claude Code — per-thread STATE handoffs + a compiled INDEX dashboard',
  },
  {
    name: 'notion-mcp',
    repo: 'shck-dev/notion-mcp',
    accent: '#7c3aed',
    blurb: 'Notion MCP server — search, export, and import pages as markdown; no OAuth, just a browser cookie',
  },
] as const;
```

(content.config.ts derives `releases_notion-mcp` automatically — no change there. Feed
verified live: `https://github.com/shck-dev/notion-mcp/releases.atom` → 200.)

### 4.8 `src/pages/og/[...route].ts`

Same structure; flip the palette to paper:

```ts
bgGradient: [[252, 252, 252]],
border: { color: [79, 70, 229], width: 12, side: 'inline-start' },
font: {
  title: { color: [10, 10, 10], families: ['JetBrains Mono'], weight: 'Medium' },
  description: { color: [107, 107, 107], families: ['JetBrains Mono'] },
},
```

Fonts list unchanged.

### 4.9 `src/content/posts/notion-mcp.md` (new)

Frontmatter:

```yaml
title: 'notion-mcp — Notion over MCP, no OAuth required'
description: 'MCP server for Notion using the internal API: full-text search, markdown export and import — no workspace admin, no OAuth, just your browser cookie.'
date: 2026-06-05
tags: ['notion', 'mcp', 'release']
tool: 'notion-mcp'
```

Body: authored from `/Users/shck/projects/notion-mcp/README.md`, in the voice of the existing
ccx post (terse, factual, first-person-less; ~350–500 words). Structure:

1. Intro paragraph — bold **notion-mcp**, the pitch: talks to Notion's internal API; search,
   export, import as markdown; "no workspace admin, no OAuth, no page sharing — paste three
   values from your browser and go."
2. `## The problem` — official-API friction: create an integration, get admin approval, share
   pages one by one; blocks API is read-only for practical markdown workflows.
3. `## What it does` — bullets: **Search** (full-text, whole workspace) · **Export** (clean
   markdown — headings, lists, to-dos, code, tables, images with viewable URLs) · **Import /
   Append / Create** (markdown back in as native blocks; replace, append, or new child page) ·
   **Images** (upload local or reference external) · **Comments** (list, add, reply) ·
   one-command credential setup (`npx @shck-dev/notion-mcp init` parses a pasted
   "Copy as cURL").
4. `## Install` — fenced block: `npx @shck-dev/notion-mcp init` then
   `claude mcp add notion -- npx @shck-dev/notion-mcp`; one line noting the manual
   `NOTION_TOKEN`/`NOTION_USER_ID`/`NOTION_SPACE_ID` env alternative for other MCP clients.
5. `## Trade-offs` — honest-gaps voice: internal API is undocumented and may change;
   `token_v2` expires (re-grab from browser); database rows don't export yet; import replaces
   whole-page content (append is the non-destructive path); some formatting simplifies.
6. Closing line — source/docs: [github.com/shck-dev/notion-mcp](https://github.com/shck-dev/notion-mcp) ·
   [npm](https://www.npmjs.com/package/@shck-dev/notion-mcp).

No fabricated claims: every statement must trace to the README.

### 4.10 `public/favicon.svg`

Keep the ink tile; the glyph accent goes house indigo: both `#5eead4` fills/strokes →
`#4f46e5`. (`favicon.ico` stays as-is — legacy fallback, not worth regenerating.)

## 5. Out of scope

- `rss.xml.js`, sitemap, robots, deploy workflow (`.github/workflows/deploy.yml`), Umami —
  untouched.
- No dark mode, no theme toggle.
- No shared "site stats" helper module — the ~10 duplicated frontmatter lines between
  index/changelog are deliberate (two pages, one idiom; extract only if a third consumer
  appears).
- Server-side cleanup of the old site dir on 46.224.197.82 (not reachable from this machine).

## 6. Verification

1. `bun run build` exits 0 (network: both releases.atom feeds fetch — verified 200 today).
2. `dist/blog/notion-mcp/index.html` exists and contains `/posts/notion-mcp/` (meta-refresh).
3. `dist/blog/index.html` exists and points at `/posts/`.
4. `dist/posts/notion-mcp/index.html` exists (post built).
5. `dist/og/notion-mcp.png` and `dist/og/site.png` exist.
6. `dist/index.html` contains `fcfcfc` and the stats band; contains **no** `5eead4`, `blink`,
   `SF Mono`.
7. Source sweep: `rg -n "5eead4|blink|SF Mono|--dim|post-list|tool-list|#161616" src/` → no hits.
8. Eyeball `bun run preview` on /, /posts/, /posts/notion-mcp/, /changelog/.

## 7. References

- House kit: `rjf-auto-apply-microservice/.claude/skills/html-report/SKILL.md` + `skeleton.html`
- npm package whose README links the restored URL: `@shck-dev/notion-mcp` v0.5.1
- Old-site investigation: `/blog/notion-mcp` live-404 confirmed 2026-06-05; no Wayback
  snapshots of shck.dev exist; old content unrecoverable locally — hence a fresh post, not a
  restoration of lost prose.
