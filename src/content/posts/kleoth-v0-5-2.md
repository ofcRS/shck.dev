---
title: 'kleoth v0.5.2'
description: 'Kleoth 0.5.2 — release notes.'
date: 2026-09-27
tags: ['kleoth', 'release']
tool: 'kleoth'
draft: true
---

**[Kleoth 0.5.2](https://github.com/ofcRS/kleoth/releases/tag/v0.5.2)** is out.

## Install

Download **Kleoth-0.5.2.dmg** (8.3 MB), open it, and drag Kleoth.app onto Applications. Builds are self-signed, not notarized, so macOS blocks the first launch once. On macOS 15 or later, click **Done**, then System Settings → Privacy & Security → **Open Anyway**. On macOS 14, right-click Kleoth.app → **Open**.

SHA-256: `8ce18e6f7db636a2dd9b5dc80282159d58c5b68dd2b2b2133b3bdc1f69032b10`

Upgrading from an earlier version: just replace the app. Your data in `~/Kleoth` and your keys in the Keychain are untouched.

### Fixed

- **Kleoth quit at launch on every Mac but the one that built it** ("could not load resource
  bundle", #17). The app looked for its images in a folder that exists only on the build Mac, so
  every release so far crashed on first launch anywhere else. It now finds them inside the app.
  If you worked around it by copying `KleothApp_KleothApp.bundle` to the top of Kleoth.app,
  replacing the app with this version removes the copy (and restores the app's signature).

New in 0.5.1, the release before this fix: dictation that fits the text you dictate into, meetings from the pill, calls that offer to be recorded, and full-width meeting covers. See the [0.5.1 notes](https://github.com/ofcRS/kleoth/releases/tag/v0.5.1).


<!-- draft: edit me, set draft: false, merge to publish -->
