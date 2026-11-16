---
title: 'kleoth v0.5.4'
description: 'Kleoth 0.5.4 — release notes.'
date: 2026-11-16
tags: ['kleoth', 'release']
tool: 'kleoth'
draft: true
---

**[Kleoth 0.5.4](https://github.com/ofcRS/kleoth/releases/tag/v0.5.4)** is out.


## [0.5.4] — 2026-11-16

### Fixed

- **A meeting could lose your microphone without a word, and then refuse to transcribe.** On some
  Macs the built-in microphone reports three channels (seen on macOS 27 with a Bluetooth headset as
  the output). Kleoth opened the microphone file for three channels, every write to it failed, and
  nothing said so: the meeting looked like it was recording, the file stayed empty, and afterwards
  the meeting could not be played or transcribed. A microphone wider than stereo is now mixed to
  mono, in meetings, dictation and screen recordings alike.
- **A meeting whose microphone was not recorded says so**, on the meeting itself, and the other side
  still plays and transcribes. Meetings already saved in this state transcribe too: Kleoth rebuilds
  the missing audio file from the other side when you start the transcription.

### Changed

- **Meeting covers are drawn wide.** The meeting page shows its cover as a full-width band, and a
  square picture showed only its middle third there. New covers are 16:9, with the characters kept
  in the middle so the small square in the meetings list still shows them. Covers you already have
  stay as they are; choose New Cover to redraw one wide.


SHA-256: `832870b9e1da507c1ec19b18c5733f863847ae2041ba9d739d02574a932bda03`


<!-- draft: edit me, set draft: false, merge to publish -->
