---
title: 'ccx v0.1.0 — a scratch notebook for Claude Code'
description: 'First public release of ccx: per-thread STATE.md handoff docs plus a compiled, parallel-session-safe INDEX dashboard, packaged as a Claude Code plugin.'
date: 2026-06-04
tags: ['ccx', 'claude-code', 'release']
tool: 'ccx'
---

First public release of **ccx** — context management for Claude Code sessions that survives
context loss, packaged as a portable plugin.

## The problem

Long-running agentic work dies when the context window resets. Notes scatter, throwaway
scripts pollute the repo, and parallel sessions clobber each other's state.

## What ccx does

- **`/ccx:start-thread`** — every unit of work gets its own `.scratch/<thread>/STATE.md`
  handoff doc: the ask, the plan, current state, open questions. A fresh session reads it
  and picks up where the last one died.
- **`/ccx:save-state`** — compiles a single-pane `INDEX.md` dashboard from every thread's
  frontmatter plus live git state. It's a *pure render*, written atomically — concurrent
  sessions converge instead of overwriting each other.
- **`/ccx:tidy-scratch`** — date-aware garbage collection: dry-run plan first, archive over
  delete, never touches anything carrying a handoff doc without asking.
- Two hooks keep things tidy: one denies throwaway scripts written outside the notebook,
  one auto-links new notes into their thread's graph (Obsidian-friendly).

Language-agnostic — the scripts run under bun regardless of what your project is written in.
No ticket system required.

## Install

```
/plugin marketplace add shck-dev/ccx-context-system
/plugin install ccx@ccx-context-system
```

Source, docs, and the concurrency design notes:
[github.com/shck-dev/ccx-context-system](https://github.com/shck-dev/ccx-context-system).
