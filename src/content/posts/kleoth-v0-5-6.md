---
title: 'kleoth v0.5.6'
description: 'Kleoth 0.5.6 — release notes.'
date: 2026-11-17
tags: ['kleoth', 'release']
tool: 'kleoth'
draft: true
---

**[Kleoth 0.5.6](https://github.com/ofcRS/kleoth/releases/tag/v0.5.6)** is out.


### Fixed

- **A meeting recorded without its microphone still refused to transcribe.** 0.5.4 rebuilt such a
  meeting's audio, but both transcription paths went on to open the empty microphone file and
  stopped there. An empty channel is now treated as silent: the other side is transcribed and
  summarized, on device and in the cloud.


SHA-256 (Kleoth-0.5.6.dmg): e76de8a81a7b4959cf45dac25f6ec5a195562eaf16a125c0ebd5e09819c58ced


<!-- draft: edit me, set draft: false, merge to publish -->
