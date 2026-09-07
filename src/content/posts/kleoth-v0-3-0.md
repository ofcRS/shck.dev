---
title: 'kleoth v0.3.0'
description: 'Kleoth 0.3.0 — release notes.'
date: 2026-09-07
tags: ['kleoth', 'release']
tool: 'kleoth'
draft: true
---

**[Kleoth 0.3.0](https://github.com/ofcRS/kleoth/releases/tag/v0.3.0)** is out.

## Install

Download **Kleoth-0.3.0.dmg** (12.2 MB), open it, and drag Kleoth.app onto Applications. Current builds are self-signed: on first launch, right-click Kleoth.app → **Open**.

SHA-256: `00fd1be64f4e1cdeec84555acc8a501d6f1cd717089b7aeaf95181e09218e10c`

Upgrading from 0.2.0: just replace the app. Your data in `~/Kleoth` and your keys in the Keychain are untouched.

### Added

- **Screen recording.** Hover the pill and click the red record glyph — or pick "Record screen…"
  from the menu-bar popover — to record your screen with system audio and your microphone in one
  file. A dimmed picker lets you drag a region or press Return for the whole display (Esc cancels);
  the pill then shows a live timer, and hovering it turns the timer into a stop button. When you
  stop, the pill confirms with the length and file size — click it to reveal the recording in
  Finder. Files land in `~/Kleoth/screen-recordings/` as 1080p H.264 MP4s (about 22 MB per minute)
  that you own outright: nothing is uploaded. Quitting mid-recording asks
  first and still saves the file, and a recording interrupted by a crash is recovered on the next
  launch. Recording and dictation coexist — dictating during a recording morphs the pill in place
  and hands it back when you are done.
- **Recordings viewer (proof of concept).** History gained a Recordings scope listing every screen recording. Each
  recording is transcribed on device right after it is saved (word timings included); the viewer plays
  the video with the transcript beside it, highlights the word being spoken, seeks when you click a
  word, and lets you double-click a word or the title to correct it. Older recordings can be
  transcribed on device or in the cloud from the viewer. The transcript lives in a small `.json`
  next to the `.mp4`; the movie itself is never modified. This is deliberately a first cut: no
  trimming, no sharing, no export, no live subtitles — the recording is the file, the transcript is
  the sidecar, and the viewer just shows them side by side.
- **A live recording toolbar.** While recording, the pill becomes a bar with a pulsing dot, the
  elapsed time, live microphone and system-audio meters, and an explicit Stop button — only Stop
  stops, so a stray click cannot end a recording. The bar stays horizontal on every screen edge and
  follows a drag cleanly, and dictating mid-recording keeps the capsule horizontal too.
- **Menu-bar popover rows are clickable across their whole width**, not just on the label text.
- **The resting pill reacts to the pointer.** Hovering the half-tucked capsule pulls it fully on
  screen with a mic glyph; it tucks back shortly after the pointer leaves.
- **The pill answers the hotkey on the first frame.** Pressing fn+shift now hops the resting
  capsule out of its edge immediately (mic on, mic glyph); the waveform grows out of it once the
  hold is confirmed, which now takes 0.2 s instead of 0.3 s. A short tap sinks it back.
- **`pillsandbox` (dev tool).** `swift run --package-path app pillsandbox` opens a control window
  that drives the real pill through every phase, edge and mic level with no signing, Keychain or
  Accessibility involved; `--film <dir>` renders a transition to PNG frames plus a contact sheet
  so the motion can be reviewed without watching the screen.

### Changed

- **Dictations into a terminal get the full clean-up.** Terminals (Ghostty, iTerm2, Terminal,
  Warp, kitty, Alacritty) used to get a deliberately plain, single-line, keep-every-word polish.
  Coding assistants such as Claude Code live inside a terminal, so long spoken prompts came back
  as one unbroken paragraph with spoken self-corrections left in. Terminals now get the same
  restructuring as editors and AI chats: paragraphs, lists where you enumerated, the word you
  settled on. Messaging apps are unchanged.
- **Faster pill motion.** Every rise, sink, morph and hover peek runs in roughly 0.2–0.35 s
  (was 0.5–0.55 s); the stretch and content reveal are scaled to match.
- **Pill motion rebuilt.** The capsule's size is now an explicit animated value, so it grows out of
  the edge instead of popping to its full shape while still tucked; a keyframed squash-and-stretch
  follows the direction of travel (squat, stretch on the way, land, settle); the waveform blooms in
  only once the pill has left the edge and fades before it sinks back; the whole capsule breathes
  with the mic level. The pill code moved into a `KleothPillUI` library shared by the app and the
  sandbox.

### Fixed

- **Bluetooth headphones stayed in phone-call quality after a dictation.** Each dictation put a
  headset into its hands-free profile (as any microphone use does), but the profile never released:
  music and system sound stayed tinny until Kleoth was quit. A stopped audio engine still holds the
  microphone open as long as the engine object exists, so the dictation and meeting captures now
  build a fresh engine per session and free it the moment the session ends, cancels or fails — the
  headset is back to full quality about a second after you let go of the hotkey. The pill now
  acknowledges the press before the microphone opens, so the slightly slower engine start is not
  felt.
- **Crash a few seconds after starting a dictation.** Five crash reports (2026-09-04…06) shared one
  signature: an Objective-C exception from AVFoundation — "Failed to create tap due to format
  mismatch" — raised when the hotkey opened the mic after the default input device had changed
  while Kleoth was idle (a Bluetooth headset connecting or disconnecting). AppKit swallowed the
  exception, which corrupted the Swift runtime's thread state, and the app then died on the next
  hotkey press or timer tick. Both causes are fixed: every capture now installs its tap at the
  hardware's current input format (the engine's cached output format goes stale across a device
  switch and never recovers), and every AVFoundation call that can raise is bridged into a Swift
  error, so a refused tap shows a red pill instead of taking the app down.
- **Polish timing out on long dictations.** Installs that opened Settings on 2026-09-03 had the
  slow former polish model persisted as their choice and kept using it — a fifth of all polishes
  ran past the 8 s budget and pasted the raw transcript. That slug now migrates to the current
  default (the same texts polish in 1–2 s), the ceiling is 30 s instead of 8 s, and pressing Esc
  while the pill is polishing pastes the raw transcript immediately instead of cancelling the
  dictation. The dictation log records how long each polish took (`polish_seconds`).
- **External microphones.** Recording and dictation failed outright with a Bluetooth headset mic
  (Sony WH-1000XM5 and the like): those run at 16 kHz mono, where the AAC encoder caps at 48 kbps and
  rejected Kleoth's fixed 64/128 kbps request. The bit rate now follows the encoder's own limit for
  the device's format. Both captures also survive the profile switch a Bluetooth headset performs
  right after its mic is opened, and a device swap mid-session: the tap is reinstalled and the audio
  is converted into the file already being written, instead of the capture ending at the switch.
- **Dictation pill jumped sideways on a left/right edge.** After every transition the pill's
  window was being widened by SwiftUI to fit the capsule's un-rotated width, re-centering the
  capsule 23–31 pt toward the screen edge (and pushing the resting sliver fully off-screen). The
  capsule is now an overlay on a size-less root, so only Kleoth sizes that window. Bottom/top
  edges were never affected.

### Changed

- **Short dictations and chat messages are pasted as heard.** The OpenRouter clean-up call now
  runs only when it earns its latency: dictations of fewer than 24 words, and every dictation into
  a messenger (Telegram, Slack, Discord, Teams, WhatsApp, Messages, Linear), paste Scribe's
  transcript directly — `no_verbatim` already strips fillers, so a casual one-liner arrives ~1 s
  sooner with no LLM in the loop and no risk of a rewrite. Longer dictations into editors, AI
  chats, notes, mail and browsers are still cleaned up and structured. Settings → Dictation →
  "Also clean up short dictations and chat messages" restores the old always-polish behavior
  (Keychain `dictation_polish_always`). Skipped rows show an "As heard" badge in the Dictations
  detail pane (not the orange "Raw" fallback — nothing failed).


<!-- draft: edit me, set draft: false, merge to publish -->
