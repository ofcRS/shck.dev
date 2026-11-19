---
title: 'kleoth v0.5.9'
description: 'Kleoth 0.5.9 — release notes.'
date: 2026-11-19
tags: ['kleoth', 'release']
tool: 'kleoth'
draft: true
---

**[Kleoth 0.5.9](https://github.com/ofcRS/kleoth/releases/tag/v0.5.9)** is out.


### Fixed

- **The pill could turn into an empty grey capsule after you stopped a meeting.** Once "Meeting
  saved" folded back into the edge with the pointer still on the pill, the dock (Dictate · Meeting ·
  Screen · More) came out with none of its buttons, and stayed blank for as long as the pointer
  stayed on it. The same could happen whenever the pill changed again within a moment of folding
  away. The dock now shows its buttons at once, and whatever the pill shows next is drawn as soon
  as it lands.
- **A meeting's bar could come up empty.** When a meeting recording started just as a dictation
  finished and the pill was folding away, the bar rose with no red dot, no timer and no Stop button
  while the meeting recorded. It now always shows them.
- **The pill could vanish with its menu open.** If the pill's menu was open over "Meeting saved"
  (or a recording's saved message) when that message went away, the pill slid half off the screen
  and drew nothing. It now opens as the dock beside its menu.



<!-- draft: edit me, set draft: false, merge to publish -->
