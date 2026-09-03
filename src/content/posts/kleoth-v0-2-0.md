---
title: 'kleoth v0.2.0'
description: 'Kleoth 0.2.0 — release notes.'
date: 2026-09-03
tags: ['kleoth', 'release']
tool: 'kleoth'
draft: true
---

**[Kleoth 0.2.0](https://github.com/ofcRS/kleoth/releases/tag/v0.2.0)** is out.

## [0.2.0] — 2026-09-03

### Added

- **Dictation (hold fn+shift, speak, release).** System-wide voice typing: the utterance is
  transcribed by ElevenLabs Scribe (`scribe_v2`, `no_verbatim`, your personal-dictionary terms
  as keyterms), cleaned up by ONE short OpenRouter "polish" call (fillers/self-corrections removed,
  never translated — falls back to the raw transcript within 8 s if the model is slow, blocked, or
  changes the language), and pasted into whatever app has keyboard focus via the clipboard + a
  synthetic ⌘V; your previous clipboard is restored 0.5 s later. Double-tap for hands-free, tap
  once to stop, Esc cancels. A small dark pill rests half-tucked into a screen edge (bottom by
  default; drag it along the edge, or toward another edge to dock it there — side edges stand it
  up) and springs out while you speak: a live waveform while listening, a travelling wave while
  transcribing and polishing, a check when the text has landed, words only for warnings and
  errors. Silence just puts it back. Text-only history lands in `~/Kleoth/dictations/<day>.json` and is
  browsable from the new **Dictations** scope in the History window; a personal dictionary lives
  in `~/.config/kleoth/dictionary.json` (Settings → Dictation). Audio is never kept. Opt-in
  (Settings → Dictation) and requires the **Accessibility** permission (for the hotkey and the
  paste); `dictate` is a headless CLI probe for the pipeline.
- **Polish adapts to where you're typing.** In composition surfaces — AI chats (Claude, ChatGPT,
  Cursor…), editors, notes, documents, mail, browsers — the polish step restructures spoken
  brainstorming into the text you would have typed: ideas reordered, fragments merged, spoken
  lists rendered as lists, the word you settled on kept, thinking-out-loud dropped, every point
  preserved and nothing invented. Messaging apps get a light touch that keeps your sentence order
  and voice; terminals get plain single-line text. The spoken language is always kept, including
  Russian sentences with English technical terms.

- **Choose the engine per meeting.** An untranscribed recording's detail pane now offers
  both **Transcribe** (free, on-device) and **Transcribe in cloud** (ElevenLabs Scribe, your
  key) side by side.
- **Per-tier transcript variants.** Re-transcribing a meeting with the other engine keeps the
  previous transcript + summary as a variant instead of overwriting it — switch between the
  On-device and Cloud versions from the tier badge in the meeting detail view.
- **Folder sizes.** Meeting rows, the detail view, and multi-selection now show each meeting's
  size on disk, and Settings totals your `~/Kleoth` footprint.
- **Remove Transcription.** Revert a meeting to its saved audio — the transcript, summary, and
  any variants move to the Trash (recoverable) while the recording, title, and speaker names
  stay, ready to re-transcribe. Available from the History context menu (multi-select works)
  and the detail toolbar.
- **Failed runs now explain themselves where you're looking.** When a transcription or
  summarization fails (e.g. an ElevenLabs payment/quota issue), the meeting keeps a visible
  record of it: a dismissible error card in the meeting detail view and a red "Failed" chip on
  its History row (hover for the message). Previously the error appeared only in the menu-bar
  popover's status line, so from the History window a failed cloud transcription just silently
  reverted to *Untranscribed*. Retrying, dismissing, or trashing the meeting clears it.

### Changed

- **Default summary model is now `z-ai/glm-5.3-flash`** (was the retired
  `google/gemini-3-flash-preview`). The dictation polish model defaults to
  `google/gemini-3.5-flash-lite` (median ~0.9 s per dictation in live measurements, vs 3–4 s on
  GLM) and falls through to `z-ai/glm-5.3-flash` when the primary is unreachable. A stored
  retired slug is migrated in memory on every launch and rewritten in the Keychain the first time
  Settings opens. Why not Gemini: accounts whose OpenRouter privacy settings enforce Zero Data
  Retention find every `google/*` model blocked (404 `zdr-violation-by-account`), while GLM works
  under both the no-train and ZDR guardrails. `google/gemini-3.8-flash` remains selectable in the
  picker — relax the guardrail at openrouter.ai/settings/privacy to use it.
- Cloud transcription (Scribe) requests for dictation send `no_verbatim=true` (fillers dropped
  server-side); meeting transcription is unchanged.
- **Transcription after recording is now opt-in.** Stopping a recording saves the audio and
  lists it as *Untranscribed*; transcription starts only when you choose an engine on the
  meeting (or turn on "Transcribe automatically after recording" in Settings). This applies to
  existing installs too — flip the new toggle to restore the old always-transcribe behavior.

### Fixed

- **Playback now plays both sides in both ears.** The built-in player live-downmixes the
  2-channel meeting file (your mic on the left, the other side on the right), so you no longer
  hear yourself only in the left ear. The file on disk keeps its channel layout.
- Over-amplified microphone peaks are now clamped during loudness normalization, preventing
  hard clipping in future recordings' combined audio.
- Summaries are no longer silently truncated: completions cut off at the output
  cap (`finish_reason == "length"`) are retried with a larger budget and a
  truncated result is surfaced as a failure rather than shipped half-empty.
- The onboarding "Start your first recording" button no longer no-ops after
  "Skip setup" — it routes to the permissions step so consent is acknowledged.

### Removed

- **Slack integration.** The Slack webhook export is gone — the `kleoth slack`
  CLI subcommand, the Settings webhook field, the "Post to Slack" Shortcut /
  App Intent, the `kleoth://slack-latest` URL verb, and the detail view's "Copy
  for Slack" action (replaced by a Slack-free **Copy Summary** that copies the
  rendered Markdown).


### Install

Download the DMG, drag Kleoth to Applications, then **right-click → Open** on first launch (the build is self-signed, not notarized).

SHA-256: `46544836789b46c046d97ecb41d6b7cd5212f05eb83153b64ae49f1bc5b46e2e`


<!-- draft: edit me, set draft: false, merge to publish -->
