---
title: 'kleoth v0.5.0'
description: 'Kleoth 0.5.0 — release notes.'
date: 2026-09-25
tags: ['kleoth', 'release']
tool: 'kleoth'
draft: true
---

**[Kleoth 0.5.0](https://github.com/ofcRS/kleoth/releases/tag/v0.5.0)** is out.

## Install

Download **Kleoth-0.5.0.dmg** (7.8 MB), open it, and drag Kleoth.app onto Applications. Builds are self-signed, not notarized, so macOS blocks the first launch once. On macOS 15 or later, click **Done**, then System Settings → Privacy & Security → **Open Anyway**. On macOS 14, right-click Kleoth.app → **Open**.

SHA-256: `2243af2c1c2c93a760cb2e6af6dae658d24a38122f09df50404aebbbb4426adf`

Upgrading from 0.4.0: just replace the app. Your data in `~/Kleoth` and your keys in the Keychain are untouched.

### Added

- **Go hands-free in the middle of a dictation.** Started holding fn+shift and it's turning into a
  long one? Tap ⌘ while you hold, or click the pill: the same dictation keeps listening, you can let
  go of the keys, and it ends like any hands-free dictation (tap fn+shift or click the pill; Esc
  cancels). Nothing said so far is lost. While you hold, the pill shows a faint lock where the
  hands-free dot goes. Adding ⌥ or ⌃ mid-hold still ends the dictation as before; only ⌘ changed.
- **A dictation is never lost to a failed transcription.** When Scribe can't transcribe a
  dictation — it timed out twice, the network dropped, the key was rejected — the audio is kept
  and the pill says so: "Timed out — saved to History", with a **Retry** button that sends the
  same audio again and pastes the text into the app in front. Pressing Esc while a dictation
  transcribes stops waiting without throwing it away either ("Stopped — saved to History").
- **Untranscribed dictations in History.** They show as "Not transcribed" with an "Audio saved"
  chip and the reason. The detail pane offers **Try again in cloud** and **Try again on device**
  (the free on-device engine, when Scribe keeps failing) and copies the text to the clipboard when
  it's ready; **Show Audio in Finder** reaches the clip. Deleting the row moves its audio to the
  Trash. Once a dictation is transcribed its audio is deleted — dictations that paste keep none.
- **Meeting covers (opt-in).** A summarized meeting can get a small square picture — cute animals
  or everyday objects acting out what the meeting was about — on its History row and in its
  header. It is off by default: Settings → Meetings → Covers turns it on by picking an engine, a
  local image server (Ollama), Codex on your ChatGPT plan, or OpenRouter. The style is Animation,
  Illustration, Sketch or Clay, or Automatic to match the meeting's mood. Your AI provider writes a
  one-sentence scene from the title, the TL;DR and the start of the overview — no names, quotes or
  transcript — and only that scene goes to the image engine. The cover is drawn once, right after
  the meeting's first summary (or only when you ask), and saved in the meeting folder as
  `cover.jpg`, next to `cover.json`, which records how it was drawn. A meeting that looks personal
  — health, a performance review, pay, hiring, legal matters, family — gets no picture. Click a
  cover for **New Cover** (another idea, in any style; the old picture goes to the Trash) or
  **Remove Cover** (the picture goes to the Trash, and that meeting is never drawn again unless
  you ask); select older meetings and choose **Draw Covers** to give them one. What OpenRouter
  covers cost shows as one row in Accounts → Usage. `kleoth illustrate <dir>...` draws covers from
  the command line; `--dry-run` prints the scene and the image prompt without drawing.
- **`kleoth summarize --max-output-tokens <n>`.** Sets the summary's output-token budget (1 to
  1000000, default 8192); an answer cut off at that limit is retried once with twice the budget.
  It applies to OpenRouter and local servers — the Claude Code and Codex CLIs take no output cap.
- **`-KleothSimulateFirstRun` (testing).** Quit Kleoth, then
  `open -a Kleoth --args -KleothSimulateFirstRun YES` launches it as if consent and onboarding had
  never been done, for that launch only, so the first-run flows can be checked on a Mac that
  finished them long ago. The flag stores nothing.

### Changed

- **First launch on macOS 15 and later.** macOS 15 removed right-click → Open for apps that
  aren't notarized. The DMG's Read Me and the Homebrew cask now give the step that works: click
  Done, then System Settings → Privacy & Security → **Open Anyway**. Right-click → Open still works
  on macOS 14.

### Fixed

- **"The focused field blocks dictation" when it didn't.** Secure input is a lock any app can
  hold, and a browser can keep it after you leave its password field — so dictation into Slack
  was refused because a browser in the background still held it. The pill now names the app holding
  it ("Dia has secure input on — dictation blocked"), so you know what to close or click out of.
  The paste-time warning names it too.
- **Long dictations timing out.** Scribe got a flat 25 s whatever the length of the clip, and
  dictations of a minute or more ran out of time when the service was slow. The budget now grows
  with the clip (25 s plus half its length, up to 2 minutes), and a timeout or network error gets
  one automatic retry a second later. Each dictation records how long its transcription took.
- **"Dictation history…" opening on Meetings.** History opened from the pill menu, Settings or
  the popover's recording row now lands on the tab it was asked for, not only when the window was
  already open.
- **Incomplete or cut-off summaries.** An answer that left parts out — no overview, no action
  items — was saved and shown as a finished summary with those sections silently missing. A
  summary is now saved only when it is complete: not cut off, readable, and with a TL;DR, an
  overview, action items and per-speaker highlights (an empty overview or list is fine). An answer
  short of that gets one retry aimed at what went wrong — asked again more compactly with twice the
  room, asked for the missing parts by name, or simply asked again after an empty answer — and
  otherwise fails with a message that says why: "The summary was cut off…", "The summary came back
  incomplete (no overview)…". A cut-off is now recognized as one even when the provider reports a
  normal finish, as Codex, Claude Code and some local servers do. Nothing partial is ever written:
  the transcript is saved, and a summary already on disk stays.
- **A failed summary looked like one that was never tried.** When the summary step failed after a
  transcription, only the popover's status line said so ("summary skipped"); the meeting itself
  showed "No summary yet". The reason now shows where you look: a "Summary failed: …" card on the
  meeting and a red Failed chip on its History row (hover for the message), and the popover says
  "summary failed" with the reason. A run that writes no summary no longer names a model or
  provider in `meta.json`, so the header stops showing the model of a summary that failed.
- **Only the newest meeting's summary could be retried.** Short of transcribing a meeting again
  with the other engine (paid in the cloud, or on device for a cloud-only meeting), the app's only
  retry was `kleoth://summarize-latest` or its app intent. Every transcribed meeting without a
  summary — never summarized, or the last try failed — now has a small **Summarize** button beside
  "No summary yet". It runs the summary alone on your current AI provider, and the meeting reads
  "Summarizing…" meanwhile. It is disabled while the meeting is busy, and when no AI provider is
  available — its tooltip then says why. `kleoth://summarize-latest` now does the same for the
  newest meeting only. It says so when that meeting isn't transcribed yet, and does nothing while
  it is still processing. It never falls back to an older meeting.
- **The record hotkey did nothing before the consent notice was acknowledged.** Neither did
  `kleoth://record` or `kleoth://toggle`: Kleoth refused, but said so only in the popover's status
  line (the Start Kleoth Recording app intent answered with a dialog that offered nothing to
  click). A small **Before you record** window now comes forward with the popover's consent
  notice. **I understand — start recording** acknowledges and starts, and the window closes once
  the recording runs — or stays and shows why the start failed. **Not now** records nothing.
- **Two Settings footers that weren't true.** Meetings → Summarization called Gemini Flash the
  default (it's GLM on OpenRouter); it now names the provider your summaries run on. General →
  Shortcuts promised Shortcuts and Spotlight actions, which these builds don't surface; it now
  points at `kleoth://toggle`.


<!-- draft: edit me, set draft: false, merge to publish -->
