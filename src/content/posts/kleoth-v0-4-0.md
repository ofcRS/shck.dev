---
title: 'kleoth v0.4.0'
description: 'Kleoth 0.4.0 — release notes.'
date: 2026-09-20
tags: ['kleoth', 'release']
tool: 'kleoth'
draft: true
---

**[Kleoth 0.4.0](https://github.com/ofcRS/kleoth/releases/tag/v0.4.0)** is out.

## Install

Download **Kleoth-0.4.0.dmg** (13.7 MB), open it, and drag Kleoth.app onto Applications. Current builds are self-signed: on first launch, right-click Kleoth.app → **Open**.

SHA-256: `03313badda5b51e895f78f7c3d3f18c35f9f6a5f1bb120b5e6d9ff6d529d0cf6`

Upgrading from 0.3.0: just replace the app. Your data in `~/Kleoth` and your keys in the Keychain are untouched.

### Added

- **Bring your own AI.** Summaries and dictation cleanup can now run on the Claude Code or
  Codex CLI you already have signed in, on a local OpenAI-compatible server (Ollama, LM Studio),
  or on Apple's on-device model (macOS 26, dictation only) — OpenRouter is one option among five.
  A fresh install auto-detects what is available (Settings → Accounts → AI provider);
  `kleoth summarize --provider <id>` picks one on the command line.
- **Settings window redesigned.** A sidebar of six pages — Meetings, Dictation, Screen Recording,
  Microphone, Accounts, General — each a plain grouped form under its own title, the way System
  Settings does it: no banners, no illustrations, system type throughout. Every setting is where
  it was, grouped by what it is for; each feature page ends in a row that opens its history, and
  the Accounts page links to the providers' key pages. The window remembers the last page. The
  sidebar is a flat vibrant list beside the form, not the floating glass card with an empty
  toolbar band that macOS 26 gives a split view.
- **Pill peek dock.** Hovering the resting pill now pulls out a dock of three captioned fields —
  Dictate, Record, More — in Liquid Glass on macOS 26 (a dark ink look elsewhere), with a quiet
  hover lift and a hand cursor. Dictate starts a hands-free dictation from a click (click the
  listening pill, press fn+shift or Esc to end it), Record starts a screen recording as before,
  and More (or a right-click anywhere on the pill) opens the pill's own menu: start dictation,
  record the screen, pick a microphone, paste the last dictation, open the dictation history,
  hide the pill for an hour, settings. The fn+shift hotkey is unchanged.
- **Microphone setting.** Settings → Microphone (and the pill menu's Microphone submenu) picks the
  input device Kleoth records from — meetings, dictation and screen recordings alike. Automatic
  follows the system input; a microphone that is not connected falls back to it.

### Changed

- **New ident.** The lyre is drawn natively in the popover header and onboarding — it breathes
  at rest, quivers while a meeting records and ripples while one transcribes (still under
  Reduce Motion). New charcoal app icon, green-stone empty states and README imagery.


<!-- draft: edit me, set draft: false, merge to publish -->
