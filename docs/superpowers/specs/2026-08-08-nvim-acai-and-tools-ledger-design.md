# nvim-acai on the site, and the tools ledger

Date: 2026-08-08

Two changes shipped together: nvim-acai gets a launch post and a place in the registry, and the
home page's tools section stops being a two-column grid.

## Why

nvim-acai (`ofcRS/nvim-acai`) is a Neovim plugin that renders inline AI ghost text from any
OpenAI-compatible provider. It belongs on the site the way kleoth does — a post in `/posts/` plus a
`TOOLS` entry that feeds the home grid and `/changelog`.

Adding it makes four tools, which exposes what was already wrong with the tools grid. The two-column
`.cells` primitive gives each blurb roughly 28 characters of measure, so blurbs written as sentences
wrap to four or five lines; grid row-stretching then pads every short cell to the height of the
tallest one beside it. And an odd tool count leaves the ruled rectangle open, patched today by
appending an `aria-hidden` filler `<div>` that also needs a `display: none` at 620px. The filler is a
symptom — the layout cannot close itself.

## Scope

1. `src/content/posts/nvim-acai.md` — launch post.
2. `TOOLS` entry plus the three hand-written prose spots that name tools individually.
3. Tools layout: `.cells`/`.cell` replaced by a `.ledger`/`.lrow` primitive.
4. `/changelog` skips tools whose release feed is empty.
5. Commit and push to `main` (fires `deploy.yml`).

Out of scope, flagged to the user and left alone: nvim-acai's README claims MIT while the repo has no
`LICENSE` file, and the repo has no tags, so the site shows it unversioned. Both are fixes in that
repo.

## The post

`src/content/posts/nvim-acai.md`, frontmatter per the `posts` schema in `src/content.config.ts`:
`tool: 'nvim-acai'`, `date: 2026-08-08`, tags `['nvim-acai', 'neovim', 'lua']`, `draft` omitted.

A short launch note of roughly 300 words, not a technical essay. Order: what it is, one paragraph on
why provider-agnosticism is structural rather than a feature (there is no vendor SDK — `http.lua`
shells out to `curl` via `jobstart`, and a provider is two functions, `build_request` and
`parse_response`, so a local Ollama is the same code path as Anthropic), the lazy.nvim snippet and
the API-key environment variable, the keymap table, and a closing note that it is pre-release.

The repo's `assets/demo.gif` (128 KB, consistent with existing post images) is copied to
`public/img/nvim-acai/demo.gif` and leads the post.

OG image generation and RSS inclusion need no work — both derive from the collection.

## Registry and prose

`TOOLS` gains a fourth entry: `name: 'nvim-acai'`, `repo: 'ofcRS/nvim-acai'`, an `accent` (vestigial,
read by nothing, set for consistency), and a blurb.

Order stays declaration order, with nvim-acai appended. The list is not sorted by release date; the
author controls sequence by editing the array.

The three prose spots that name tools individually each grow from three names to four: the hero
sentence in `src/pages/index.astro`, `SITE.description` in `src/site.config.ts`, and the
`description` passed to `<Base>` in `src/pages/changelog.astro`. The changelog description names
nvim-acai even though the page will not render a section for it yet — the description states the
page's subject, and leaving the name out would become stale the moment a tag is cut.

## The ledger primitive

`.cells`/`.cell` is used in exactly one place, the tools grid in `index.astro`. Replacing that grid
makes the primitive dead CSS, so it is removed from `Base.astro` rather than left as unused
vocabulary.

The replacement, `.ledger`/`.lrow`, is one full-width ruled row per tool:

```
grid-template-columns: 124px 1fr auto
```

- **Rail** (124px, pixel font, gray) — two spans, a zero-padded ordinal and the latest release date.
  Two spans rather than a `<br>` so the mobile rule can lay them out horizontally.
- **Body** (`1fr`) — tool name at 18px linking to the repo, blurb at its natural measure capped at
  56ch, repo slug in the pixel font underneath.
- **Stamp** (`auto`) — version, flush right, citron-filled. A tool with no releases renders `wip`
  outlined instead: transparent background, 1px rule. An unreleased tool must not wear the same
  badge as a shipped version.

The 124px rail matches `.row`'s existing date column, so the tools section and the posts list below
it share one vertical rhythm.

Rules follow the house pattern used by `.rows`: `border-top`/`left`/`right` on the container,
`border-bottom` on each row. The rectangle closes at any item count, which is the point.

Deleted along with the grid: the `.cell.filler` div and its `aria-hidden`, the
`tools.length % 2 === 1` check in `index.astro`, and the `.filler { display: none }` mobile rule.

Below 620px the rail spans the full width as a horizontal `index · date` line above the name:

```css
.lrow { grid-template-columns: 1fr auto; }
.lrow .rail { grid-column: 1 / -1; display: flex; gap: 10px; }
```

Per the house rule, the primitive lives in the global block at the bottom of `Base.astro`; only the
hero's page-local styles stay in `index.astro`.

## Changelog

`changelog.astro` currently renders every tool's section and falls back to a `(no releases yet)` note
when the feed is empty. That becomes a filter — a tool with no releases renders no section. General
behavior, not an nvim-acai special case, so the page never shows a bare heading.

The per-tool `try/catch` around `getCollection` stays exactly as it is: a failed fetch and an empty
feed both yield an empty array, and both now mean the same thing downstream.

`index.astro` needs no equivalent change — a tool with no releases still belongs in the tools list,
it just shows `wip`.

## Documentation

`CLAUDE.md` describes `.cells`/`.cell` as "THE primitive ... used for tools" and documents the
filler-cell hack. Both statements stop being true. The shared-vocabulary list and the tools-grid
paragraph are updated in the same pass, and the changelog's empty-feed behavior is noted.

## Verification

`bun run build` must pass. It fetches the release feeds over the network, including
nvim-acai's — a repo with zero releases serves a valid but empty `releases.atom`, which is the empty
array the changelog filter now depends on. Confirming that build output is what proves the
empty-section path works, rather than assuming it.

## Commits

Four, mirroring the kleoth precedent of separating the post from the listing:

1. `post: nvim-acai — inline AI autocomplete for Neovim` (post + demo gif)
2. `tools: list nvim-acai in the tools grid and changelog` (registry + three prose spots)
3. `home: replace the tools grid with a ruled ledger` (layout + changelog filter)
4. `docs: update CLAUDE.md for the ledger primitive`

Pushed to `main`, which fires `deploy.yml`.
