---
title: 'Kleoth 0.2.0 — hold a key, talk, get typed text'
description: 'Kleoth now does system-wide dictation: hold fn+shift, speak, release, and the cleaned-up text lands in whatever app has focus. ElevenLabs Scribe for the ears, one small LLM call for the editing, your own keys, and about a fifth of a cent per utterance.'
date: 2026-09-03
tags: ['kleoth', 'macos', 'swift', 'dictation', 'release']
tool: 'kleoth'
---

Kleoth 0.2.0 adds voice typing. Hold **fn+shift** anywhere on your Mac, say what you mean,
let go, and a second or two later the text is in whatever app has the keyboard focus — the
Claude prompt box, a Slack message, a commit message in the terminal. Not a transcript of what
you said: the text you would have typed. It's opt-in, it uses your own ElevenLabs and OpenRouter
keys, and it's in the DMG at
[github.com/ofcRS/kleoth/releases/tag/v0.2.0](https://github.com/ofcRS/kleoth/releases/tag/v0.2.0).

## Why build this into a meeting recorder

I had been using Wispr Flow for a few weeks and liked the shape of it — a key you hold, a pill
at the bottom of the screen, text that appears. Two things pushed me out. The free tier is 2,000
words a week, which I burn through by Tuesday, and the paid tier is $15 a month. And it handles
my speech badly: half of what I say is Russian with English technical terms in it, and whatever
model they run kept flattening that to one language or the other.

Kleoth already had the pieces. It talks to ElevenLabs Scribe for cloud transcription of
meetings, and to OpenRouter for summaries, with keys stored in the Keychain. Scribe v2 is the
best speech model I've used for code-switching, and it bills per second of audio. A twenty-second
utterance costs about a tenth of a cent there, plus a smaller fraction for the editing call. My
first morning of heavy use came to a few cents. I pay for what I use, and nothing in the loop is
somebody else's subscription.

## What happens between key-down and paste

The chord is watched with global `NSEvent` monitors, which is what the Accessibility permission
is for. A pure state machine decides what a press means: a tap under 300 ms is ignored (that's
you reaching for an arrow key), a hold is push-to-talk, and a double-tap latches hands-free
until you tap again. The microphone is opened at key-down, before the pill even appears, so the
first syllable isn't lost.

On release the clip is mixed to mono, loudness-normalized, encoded at 64 kbps, and sent to
Scribe v2 with `no_verbatim` (it drops fillers server-side) and up to a hundred terms from a
personal dictionary as `keyterms` — the names and jargon it would otherwise mishear. The raw
transcript then goes through **one** OpenRouter call with a strict JSON schema, on
`google/gemini-3.5-flash-lite` by default, which comes back in about a second. Then a
pasteboard write and a synthetic ⌘V, and your previous clipboard is put back half a second
later. If the editing call is slow, blocked, or answers in the wrong language, the raw
transcript is pasted instead within eight seconds, with an orange note on the pill. Text always
lands.

Nothing is kept except text. Each day's dictations go into `~/Kleoth/dictations/<day>.json`
and show up under a **Dictations** scope in the History window; the audio clip is deleted the
moment the pipeline is done with it.

## The editing depends on where you're typing

This is the part I care about most. I'm not a native English speaker, and when I dictate a
prompt for an AI assistant I'm thinking out loud: I restart sentences, I hunt for a word ("the
approach, no, the strategy"), I remember the important thing last. A transcript of that is
faithful and useless.

So the editing call is told what app the text is going into, and picks one of three modes:

- **compose** — AI chats, editors, notes, documents, mail, browsers: reorder the points, merge
  the fragments, render "first… second… and also…" as a list, keep the word I settled on,
  drop the thinking-out-loud. Every substantive point is kept, a "maybe" stays a "maybe", and
  nothing is invented.
- **chat** — Slack, Telegram, Messages, Discord: fillers and punctuation only. Sentence order
  and voice untouched, because a restructured chat message reads like it came from someone else.
- **terminal** — plain text, one line, and a spoken description of a command stays a
  description. It never turns "run the tests" into a command.

Here is a real one, said into Claude:

> okay so um I want to I want you to look at the the recording controller because it's it's
> too big like it does everything um the the capture, the pipeline, the the list of meetings,
> everything. and I'm thinking maybe we should uh we should split it, no not split, extract,
> extract the the queue part, the pipeline queue, into its own, its own type. um also, wait,
> before that, actually first, we need tests for it because right now there is no tests for the
> app package at all […] don't do it yet, just just propose the plan, like how you would do it,
> and what what risks you see.

And what got pasted:

> Look at the recording controller because it is too big and does everything: the capture, the
> pipeline, the list of meetings, and more.
>
> 1. Add tests first, because right now there are no tests for the app package at all, so if
>    we change something we won't know if we broke it.
> 2. Extract the queue part, the pipeline queue, into its own type.
> 3. Move the meeting errors dictionary together with the queue because it shares the same
>    responsibility.
>
> Don't do it yet — just propose the plan and what risks you see.

The same sentence said into Slack comes out as one casual line. Russian stays Russian, and a
Russian sentence with `pipeline queue` and `MainActor` in it stays exactly that mixed. I
benchmarked six of these rambles across eight models before settling on the default; the lite
Gemini was the fastest and, to my surprise, the most faithful. Claude Haiku 4.5 was as good and
twice as slow. A couple of models timed out or truncated under the strict schema and are not
offered.

## The pill

Between dictations a small dark tab rests half off the bottom edge of the screen. Hold the chord
and it springs out into a bar with a live waveform; release and the bars carry a wave while it
transcribes and edits, then a check, then it sinks back. No words in any of that — words only
appear for a warning or an error, because those need a reason and sometimes a button.

You can drag it along its edge, or drag it clearly toward another edge and it docks there; on
a side edge it stands up and everything, waveform included, runs vertically. The animation
itself was the hardest bit of UI in the release. Animating an `NSWindow`'s frame with AppKit's
animator while SwiftUI animates the content inside it gives you two clocks and two curves
fighting, and it looked like it. The window is never animated now: on each move it is set,
instantly, to a transparent stage covering both the start and the end rect, one SwiftUI spring
carries the capsule's offset, size and rotation, and when the spring settles the window shrinks
back to the capsule. A second spring, staggered by ninety milliseconds, handles the shape
change, with a quick squash-and-stretch as anticipation. It reads as one elastic motion.

## Also in 0.2.0

- **Transcribing a meeting after recording is now opt-in.** Stopping saves the audio and lists
  it as *Untranscribed*; you pick the engine per meeting, on-device or cloud, when you want it.
- **Per-engine transcript variants.** Re-transcribing with the other engine keeps the previous
  transcript and summary; switch between them from the tier badge.
- **Remove Transcription** reverts a meeting to its audio (transcript and summary go to the
  Trash), and rows now show their size on disk.
- **Playback plays both sides in both ears** — the two-channel file is downmixed live instead of
  giving you yourself in the left ear.
- **Failures are visible where you're looking**: an error card on the meeting and a red chip on
  its row, instead of a line in the menu-bar popover you'd never see.
- The Slack integration is gone; Copy Summary replaces it.

## Rough edges

- Dictation needs the **Accessibility** permission, for the hotkey and for the paste. Kleoth is
  deliberately not sandboxed — the sandbox blocks posting the synthetic ⌘V outright, so there is
  no Mac App Store path for this feature.
- The paste is a synthetic ⌘V on the `V` key's QWERTY position. Russian and other QWERTY-family
  layouts work; Dvorak and Colemak are not handled yet.
- It is not free: a few tenths of a cent per utterance across two providers, on your keys.
- Still self-signed, still right-click → Open on first launch.

Download: [github.com/ofcRS/kleoth/releases/tag/v0.2.0](https://github.com/ofcRS/kleoth/releases/tag/v0.2.0).
Full notes in the [changelog](/changelog).
