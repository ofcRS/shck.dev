# shck.dev

Source of [shck.dev](https://shck.dev) — blog + tool changelog, Astro 6, self-hosted.

## How it works

- **Posts** — markdown in `src/content/posts/`; frontmatter contract in `src/content.config.ts`.
- **`/changelog`** — compiled at build time from each tool's GitHub `releases.atom` feed.
  Tools are listed once in `src/site.config.ts` (`TOOLS`); adding a tool = one entry there.
- **Tool release flow** — each tool repo fires `repository_dispatch` (`tool-release`) here on
  release: the site rebuilds (changelog updates), and `release-post.yml` opens a PR with a
  scaffolded draft announcement post (edit → `draft: false` → merge to publish).
- **Deploys** — `deploy.yml`: build with bun → rsync to the server as `deploy` → atomic
  symlink flip (`/var/www/shck.dev/current` → timestamped release dir, last 5 kept).
  Rollback = re-point the symlink.
- **Analytics** — self-hosted Umami at `analytics.shck.dev`; the script tag renders only
  when `PUBLIC_UMAMI_WEBSITE_ID` is set (CI repo variable `UMAMI_WEBSITE_ID`).

## Dev

```sh
bun install
bun run dev      # localhost:4321
bun run build    # static output in dist/ (fetches release feeds — needs network)
```

## Secrets / variables (GitHub Actions)

- `DEPLOY_KEY` (secret) — Ed25519 private key for the server's `deploy` user.
- `UMAMI_WEBSITE_ID` (variable) — Umami website UUID; optional, analytics off without it.
