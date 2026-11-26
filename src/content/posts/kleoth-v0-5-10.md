---
title: 'kleoth v0.5.10'
description: 'Kleoth 0.5.10 — release notes.'
date: 2026-11-26
tags: ['kleoth', 'release']
tool: 'kleoth'
draft: true
---

**[Kleoth 0.5.10](https://github.com/ofcRS/kleoth/releases/tag/v0.5.10)** is out.

### Changed

- **Meetings use the personal dictionary too.** A Cloud transcription of a meeting sends your dictionary to ElevenLabs as keyterms, as dictation already does (a request with keyterms costs slightly more), and the summary gets the same list as preferred spellings. Product and people names you added in Settings → Dictation are now spelled your way in meeting transcripts and summaries. The CLI's `--no-dictionary` sends neither.

### Fixed

- **Cloud transcripts no longer give the other side's words to you.** Each word is now You or Them by which recording (your microphone or the call's sound) carries a voice under it. A microphone that picks up nothing gives you no words, and sound from your speakers picked up by the microphone stays theirs. Known limit: on speakers, words you say while the other side is talking can still go to Them.
- **A summary of placeholder text was saved as finished**: an overview of just "...", or "x" for the title, summary and overview, and the "x" then became the meeting's name. Kleoth now asks the model once more and, if the text is still a placeholder, keeps the transcript and shows the summary as failed. A short but real summary is always kept.

Existing transcripts are not changed by this update.


<!-- draft: edit me, set draft: false, merge to publish -->
