---
title: 'nvim-acai — inline AI autocomplete for Neovim'
description: 'Ghost text suggestions as you type in Neovim, from any provider you point it at — OpenRouter, OpenAI, Anthropic, or a local Ollama. About a thousand lines of Lua and a curl subprocess.'
date: 2026-08-08
tags: ['nvim-acai', 'neovim', 'lua']
tool: 'nvim-acai'
---

I wanted Copilot's ghost text in Neovim without Copilot's opinion about which model I'm allowed
to run. So I wrote nvim-acai: inline suggestions as you type, from whatever provider you point
it at. It's at [github.com/ofcRS/nvim-acai](https://github.com/ofcRS/nvim-acai).

![Ghost text appearing inline as you type, accepted with Tab.](/img/nvim-acai/demo.gif)

## Any provider, structurally

There is no vendor SDK in it. `http.lua` shells out to `curl` through `jobstart`, and a provider
is two functions — `build_request` and `parse_response`. OpenRouter, OpenAI, and Anthropic ship
in the box, and anything speaking an OpenAI-compatible API is a config change rather than a code
change. Point `api_base` at `http://localhost:11434/v1` and a local Ollama runs the same code
path as Claude does.

## Install

```lua
{
  "ofcRS/nvim-acai",
  event = "InsertEnter",
  opts = { provider = "openrouter" },
}
```

Export the key for whichever provider you picked — `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, or
`ANTHROPIC_API_KEY` — then run `:AcaiStatus` to confirm the plugin sees it.

## Keys

| Key | Action |
|---|---|
| `<Tab>` | Accept the whole suggestion |
| `<M-Right>` | Accept the first word |
| `<C-e>` | Accept the first line |
| `<C-]>` | Dismiss |
| `<M-\>` | Ask for one manually |

All remappable, and any keymap set to `false` is simply never registered. `<Tab>` falls through
to its normal behavior when nothing is on screen.

## Staying out of the way

Typing debounces for 200ms, then the buffer around your cursor goes out as context. A response
that comes back after you've typed again, moved the cursor, left insert mode, or switched
buffers is discarded instead of shown — an editor is a fast-moving target and a suggestion
computed for a cursor position you've already left is worse than no suggestion. Ghost text also
suppresses itself while blink.cmp or nvim-cmp has a popup open.

It's early. About a thousand lines of Lua, with a headless test suite covering the races that
bit me on the way. There's no tagged release yet, so it shows up as `wip` in the tools list on
this site until I cut one.
