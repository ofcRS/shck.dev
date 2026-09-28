---
title: 'kleoth v0.5.3'
description: 'Kleoth 0.5.3 — release notes.'
date: 2026-09-28
tags: ['kleoth', 'release']
tool: 'kleoth'
draft: true
---

**[Kleoth 0.5.3](https://github.com/ofcRS/kleoth/releases/tag/v0.5.3)** is out.

## Install

Download **Kleoth-0.5.3.dmg** (8.3 MB), open it, and drag Kleoth.app onto Applications. Builds are self-signed, not notarized, so macOS blocks the first launch once. On macOS 15 or later, click **Done**, then System Settings → Privacy & Security → **Open Anyway**. On macOS 14, right-click Kleoth.app → **Open**.

SHA-256: `09a11716b11dd58502b0442a4801bae07f5d37cea0e04c672cedb8e10f96f334`

Upgrading from an earlier version: just replace the app. Your data in `~/Kleoth` and your keys in the Keychain are untouched.

### Fixed

- **Opening Settings crashed Kleoth on every Mac but the one that built it (#22).** The same trap
  as #17, one level down: Settings opens on General, whose keyboard-shortcut recorder (Start / stop
  recording) comes from the KeyboardShortcuts package, which looked for its labels in a folder
  that exists only on the build Mac. Kleoth now ships a copy of that package that finds them inside
  the app, and the release build refuses any dependency still looking in the build folder.

The release before this one, [0.5.2](https://github.com/ofcRS/kleoth/releases/tag/v0.5.2), fixed the launch crash (#17). New in [0.5.1](https://github.com/ofcRS/kleoth/releases/tag/v0.5.1): dictation that fits the text you dictate into, meetings from the pill, calls that offer to be recorded, and full-width meeting covers.


<!-- draft: edit me, set draft: false, merge to publish -->
