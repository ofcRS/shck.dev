---
title: 'kleoth v0.5.7'
description: 'Kleoth 0.5.7 — release notes.'
date: 2026-11-18
tags: ['kleoth', 'release']
tool: 'kleoth'
draft: true
---

**[Kleoth 0.5.7](https://github.com/ofcRS/kleoth/releases/tag/v0.5.7)** is out.


### Fixed

- **The pill could not be dragged from its dock.** The four fields (Dictate · Meeting · Screen ·
  More) took every press, so a drag never started and the pointer slid off the pill. Now the whole
  pill drags once the pointer has moved a few points, fields and bars alike; a click that does not
  move still clicks. Only a real button (Stop, a question's answers, ✕) never drags. The pointer
  shows an open hand where the pill only drags and a closed hand while you drag it.
- **Dragging the pill collapsed it and threw it back.** When the pointer left the dock during a
  drag, the dock folded back into the edge at its old place halfway through the drag. A dragged
  pill now keeps its shape until you let go. A dictation, a meeting or a screen recording that
  starts while you drag shows its bar at once, right under the pointer; anything else that changes
  (a dictation finishing, a recording saved) shows where you drop it. The pill also no longer drops
  a few points as the drag begins, and a press on the dock while it is still opening is a click.
- **The pill could go empty while it was busy.** A dictation, a meeting or a screen recording
  started from the pill showed a pill-shaped blank before its controls appeared, for as long as
  the start kept the Mac busy. And a pill that changed while you dragged it was drawn off its own
  window, as an empty or half-cut capsule. The controls now show from the first frame, and the
  pill always settles back to its own size after it moves.


SHA-256 (Kleoth-0.5.7.dmg): d5fa7b3a5902bd183f4fabcbe89cb4b84719b02f52d7ddb927a1986a7c2e0b59


<!-- draft: edit me, set draft: false, merge to publish -->
