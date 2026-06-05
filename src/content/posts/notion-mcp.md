---
title: 'notion-mcp: Notion over MCP, without OAuth'
description: 'MCP server for Notion built on the internal API. Full-text search, plus markdown export and import. No workspace admin and no OAuth — it uses your browser cookie.'
date: 2026-06-05
tags: ['notion', 'mcp', 'release']
tool: 'notion-mcp'
---

**notion-mcp** uses Notion's internal API, the same one the web app uses, and exposes it over
MCP: full-text search, page export to markdown, and markdown import back in. You don't need
workspace admin rights, an OAuth integration, or per-page sharing. You paste three values from
your browser and run it.

## The problem

The official Notion API makes you create an integration, get a workspace admin to approve it,
then share pages with it one at a time. Its blocks API is read-only in practice, so there's no
clean path for markdown round-trips. notion-mcp skips all of that: it uses your browser's
`token_v2` cookie, so anything you can see in Notion, the server can reach.

## What it does

- **Search** — full-text search across your entire workspace.
- **Export** — download any page as clean markdown: headings, lists, to-dos, code blocks,
  tables, links, and images with viewable URLs.
- **Import / Append / Create** — write markdown back as native Notion blocks: replace a page's
  contents, append to the end without touching what's there, or spin up a new child page
  (optionally prefilled). Each works from a string or a local file.
- **Images** — upload a local image to a page, or reference an external URL as-is.
- **Comments** — list open discussion threads, add new comments, reply to threads.
- **One-command setup** — `npx @shck-dev/notion-mcp init` parses a pasted "Copy as cURL" and
  extracts your credentials for you.

## Install

```
npx @shck-dev/notion-mcp init
claude mcp add notion -- npx @shck-dev/notion-mcp
```

`init` saves your credentials, so the `add` command needs no `env` block. To wire it up by hand
(for example, in another MCP client), set `NOTION_TOKEN` (the `token_v2` cookie),
`NOTION_USER_ID`, and `NOTION_SPACE_ID` as env vars on the server command instead.

## Trade-offs

- The internal API is undocumented and may change with Notion updates.
- `token_v2` expires periodically — re-grab it from the browser when auth fails.
- Database pages don't export their rows yet; sub-pages render as links and such pages return
  an explanatory note.
- Import replaces a page's whole contents; append is the non-destructive path, and there's no
  in-place editing of individual blocks.
- Conversion is a little lossy — some complex formatting simplifies (nested lists flatten on
  import), and external image URLs are referenced as-is rather than re-uploaded.

Source and docs: [github.com/shck-dev/notion-mcp](https://github.com/shck-dev/notion-mcp) ·
[npm](https://www.npmjs.com/package/@shck-dev/notion-mcp).
