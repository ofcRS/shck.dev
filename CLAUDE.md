# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
bun install
bun run dev      # localhost:4321
bun run build    # static output to dist/ — fetches GitHub release feeds, needs network
bun run preview
```

No tests, no linter, no formatter. `tsconfig.json` extends `astro/tsconfigs/strict`; type errors
surface via `astro check`/editor, not a script.

## Architecture

Astro 6 static site (`output: static`, zero client JS, no UI framework). Two content sources:
hand-written markdown posts, and GitHub release feeds pulled at build time.

**`src/site.config.ts` is the registry.** `TOOLS` drives the machinery: `content.config.ts` derives
a `releases_<name>` collection per tool via `@ascorbic/feed-loader` against
`https://github.com/<repo>/releases.atom`, and both the home grid and the changelog sections render
straight from it. Posts never feed that grid — a post about a tool shows up in `/posts/` only.

Adding a tool is *not* one edit, despite what the README says. The `TOOLS` entry, then three bits of
hand-written prose that name the tools individually: the hero sentence in `index.astro`,
`SITE.description`, and the `description` on changelog's `<Base>`. Declaration order in `TOOLS` is
the render order on both pages — nothing sorts by date. `accent` on each entry is vestigial:
declared, read by nothing.

A tool with no GitHub releases is fine and needs no special-casing: the home ledger lists it with an
outlined `wip` stamp in place of a version, and `changelog.astro` filters it out entirely so the page
never shows a bare heading with nothing under it. Astro logs `The collection "releases_<name>" does
not exist or is empty` during the build for such a tool — that warning is the expected path, not a
failure.

Both
`index.astro` and `changelog.astro` read those collections and normalize each entry the same way
(`data.updated ?? data.published` for the date — GitHub's atom leaves `published` null; `data.content`
for the body), each wrapped in try/catch so a failed feed degrades to an empty section rather than
breaking the build. If you change that normalization, change it in both places.

**Posts** live in `src/content/posts/*.md`; the frontmatter contract is the `posts` schema in
`src/content.config.ts` (`title`, `description`, `date`, `tags[]`, optional `tool` tying it to a
TOOLS entry, `draft`). Slug = filename. `draft: true` is filtered out of the home page, `/posts/`,
`/rss.xml`, and `getStaticPaths` in `[...slug].astro` — but *not* out of `src/pages/og/[...route].ts`,
which generates an OG image for every post including drafts.

**OG images** are generated at build by `astro-og-canvas` at `/og/<post-id>.png`, referenced from
`[...slug].astro`; other pages fall back to `/og/site.png`.

**All styling is one global block** at the bottom of `src/layouts/Base.astro` — there is no CSS
file and no Tailwind. Pages add only page-local `<style>` for their own bits. The shared vocabulary
lives there and pages depend on those class names: `.ledger`/`.lrow` (full-width ruled rows, used
for tools — `124px 1fr auto`: pixel-font rail of index + date, then name/blurb/repo, then the version
stamp; `.ver.wip` is the outlined no-release variant), `.rows`/`.row` (date + title list, used for
posts and releases), `.prose` (post body, including `table`), `.stamp` (citron "latest:" badge),
`.meta`/`.note`/`.intro`, `.rise` (staggered entrance, honors `prefers-reduced-motion`). Both ruled
primitives close their rectangle at any item count — there is deliberately no filler-cell hack.
The `.lrow` rail collapses to a horizontal line above the name below 620px.
Design language: paper `#fbfbf9`, ink `#18181b`, one accent — citron
`--signal: #c8ff00` used only for hover underlines and markers; Geist / Geist Mono / Silkscreen
(the pixel font is for meta lines and dates only); hard 1px rules instead of cards or shadows.
Cross-document crossfade comes from native `@view-transition`, not JS.

Dates render as `YYYY-MM-DD` via a local `iso()` helper duplicated in each page that needs it.

Note: `docs/superpowers/specs/2026-06-05-house-style-refactor-design.md` records an earlier design
direction (JetBrains Mono, indigo brand, 1060px shell). The current `Base.astro` supersedes it —
treat the code as the contract, not that spec.

## Release → post pipeline

Each tool repo fires a `repository_dispatch` (`tool-release`) at this repo on release. That event
triggers both workflows:

- `deploy.yml` — rebuilds and deploys, so `/changelog` picks up the release immediately.
- `release-post.yml` — opens a PR with a scaffolded `draft: true` announcement post. Edit it, set
  `draft: false`, merge to publish. The PR is optional; the changelog does not depend on it.

`deploy.yml` (also on push to `main`) builds with bun, rsyncs `dist/` to a timestamped
`releases/<UTC>` dir on the server, then flips `current` via atomic symlink and prunes to the last
5. Rollback = re-point the symlink by hand.

`PUBLIC_UMAMI_WEBSITE_ID` (CI variable `UMAMI_WEBSITE_ID`) gates the Umami script tag in
`Base.astro` — analytics are simply absent in local dev.
