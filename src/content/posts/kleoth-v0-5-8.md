---
title: 'kleoth v0.5.8'
description: 'Kleoth 0.5.8 — release notes.'
date: 2026-11-18
tags: ['kleoth', 'release']
tool: 'kleoth'
draft: true
---

**[Kleoth 0.5.8](https://github.com/ofcRS/kleoth/releases/tag/v0.5.8)** is out.


### Fixed

- **A meeting recorded with a Bluetooth headset or a MacBook's microphone played the other side at
  the wrong speed, and History could show it up to three times too long.** Your microphone and the
  other side are recorded at different rates, and the file you play back put them together as if
  they were the same. Now both are brought to one rate first, so the meeting plays at its real
  speed and shows its real length. The other side is also mixed from both of its stereo channels;
  it used to keep the left one only.
- **Meetings you already recorded are repaired in the background** the first time the new version
  opens. Their playback file is rebuilt from the two recordings it was made from, which were never
  affected, and the length saved with a transcript (and the cloud transcription cost worked out
  from it) is corrected. The repair waits while you record a meeting or the screen. It never
  downloads a file that is only in a cloud folder; it tries again at the next launch. A meeting
  page that is open while its file is repaired switches to the new file where you were. A playback
  file that was cut short and cannot be opened is rebuilt too. Transcripts and summaries were not
  affected.



<!-- draft: edit me, set draft: false, merge to publish -->
