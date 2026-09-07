---
title: 'Kleoth 0.3.0 — record the screen, keep the file'
description: 'Kleoth now records your screen with system audio and your microphone into one small MP4 you own, transcribes it on device afterwards, and shows the transcript beside the video. Plus a fix for Bluetooth headphones stuck in phone-call quality, and a crash I owed people.'
date: 2026-09-07
tags: ['kleoth', 'macos', 'swift', 'screen-recording', 'release']
tool: 'kleoth'
---

Kleoth 0.3.0 records your screen. Hover the pill that has been resting at the bottom of the
screen since 0.2.0, click the red glyph, drag a rectangle or press Return for the whole display,
and Kleoth writes an MP4 with the system audio and your voice mixed in — about 22 MB per minute
at 1080p, in `~/Kleoth/screen-recordings/`, uploaded nowhere. When you stop, it transcribes the
recording on device and opens it in a viewer with the transcript beside the video. It's in the
DMG at
[github.com/ofcRS/kleoth/releases/tag/v0.3.0](https://github.com/ofcRS/kleoth/releases/tag/v0.3.0).

## Why a screen recorder in a meeting recorder

Because I kept making Loom-shaped videos and never wanted Loom. A two-minute walkthrough for a
teammate, a bug report with narration, a demo of a pill animation for a code review. What I
wanted each time was the file: something I can drop into Slack, attach to a pull request, or
put in a folder and forget. What the tools give me is either a link to somebody's player, or —
with QuickTime or CleanShot at native Retina — a movie of hundreds of megabytes I then
hand-compress before anyone can open it.

Kleoth already had everything except the video. It knows how to open the microphone, it has a
pill on screen that already reacts to a hotkey and a hover, it has a Whisper model on the Neural
Engine and a folder of files the user owns. Adding a screen recorder was mostly deciding what
*not* to build: no account, no sharing, no trimming, no live subtitles. The recording is the file.

## Two clocks, one track

The mic and the system audio have to end up in one AAC track that stays in sync with the video
for as long as you talk. That sounds trivial and it is the part I'd redo most carefully.

Video comes from ScreenCaptureKit's `SCStream`, and so does the system audio: the stream
captures both and stamps them on the same host clock, so video and system audio need no
alignment at all — the only reason I did not reuse the Core Audio process tap that records
meetings. The microphone is a third `AVAudioEngine` input tap (meetings and dictation each have
their own), and every mic buffer arrives with an `AVAudioTime` whose `hostTime` is the same
`mach_absolute_time` the stream uses. So all three sources speak host time, and host time is
converted to a sample position relative to the first video frame.

Both audio sources are written into two-second rings at the position their timestamp says.
A twenty-millisecond timer then *pulls* a block from a quarter-second in the past out of both
rings, sums them with a soft limiter, and appends it to the writer. Pulling matters because
either source can go quiet — ScreenCaptureKit delivers nothing while the system is silent,
a headset disappears when it's unplugged — and the track must stay continuous and in sync
anyway. Silence is a block of zeros, explicitly, every twenty milliseconds.

The measurement that changed the code: a headless probe recorded ten seconds and produced a
10.23-second file. ScreenCaptureKit hands over the first frame stamped about 190 ms in the past,
so anchoring the session on "now" instead of that frame's timestamp shifts everything. Anchored
on the first frame it comes out at 10.05 s video and 10.00 s audio. A clap test puts the mic
copy about 30 ms behind the system copy on a wired setup, which is the input device's own latency
and not drift.

## The file

H.264, long edge capped at 1920 px, 30 fps, 3 Mbps at 1080p scaled by area, AAC at 48 kHz.
Screen content is mostly static so the encoder undershoots that: a real five-minute work session
came out at 22 MB per minute, a few times smaller than a native-Retina capture of the same thing.

The container is a fragmented MP4 with a fragment every ten seconds. That is the crash story:
if Kleoth dies, or you `kill -9` it, or the machine loses power, every completed ten seconds is
already a valid movie, and the next launch renames the leftover to `-recovered.mp4`. Quitting
normally mid-recording asks first and finishes the file properly. The trade-off I'm not sure
about yet is that some inline players prefer a single `moov` atom. The files play in QuickTime
and in Kleoth's own viewer; Slack's and Telegram's inline players I have not tested. One constant
flips it back to a plain MP4 if that turns out to matter.

Kleoth excludes its own process from the capture, so the pill, the region picker and the
toolbar are never in the frame — and neither is Kleoth's History window, which is why every
demo of Kleoth in this post is words.

## The pill, again

Recording has one piece of UI, and it's the pill. Hover the resting capsule and a red record
glyph appears next to the mic. Click it and the screen dims by thirty percent with a crosshair;
drag a region, or press Return for the display under the pointer. Then the capsule becomes a bar:
a pulsing dot, `mm:ss`, a live meter for the microphone and one for the system audio, and a Stop
button. Only Stop stops. A stray click anywhere else on the bar does nothing, because the bar is
also the drag handle, and losing a recording to a mis-click is the kind of thing you do once.

It coexists with dictation. Hold fn+shift mid-recording and the bar morphs in place into the
dictation capsule, does its waveform and its check mark, and hands the toolbar back with the
timer still counting — and since the recording's own mic tap never stopped, the dictated
sentence is in the recording's audio too. On a side edge the dictation capsule normally stands up
like a spine label; while a recording is live everything lies flat against the edge instead,
because a vertical timer is not something you can read.

## The viewer is a proof of concept

Every recording is transcribed on device the moment it's saved, with word timestamps — the
same Whisper model that transcribes meetings, asked for `segment.words`. The result goes into a
small JSON next to the movie; the movie is never touched. History gained a **Recordings** scope
beside Meetings and Dictations, and each recording opens with the video on the left and the
transcript flowing on the right. The word being spoken is highlighted, clicking a word seeks,
double-clicking a word lets you fix what Whisper misheard, and the edit survives a relaunch
because it's just the sidecar. Older recordings get a "Transcribe on device" button, and a
cloud button if you've added an ElevenLabs key.

I'm labelling this a proof of concept on purpose. It does exactly what's listed and nothing
more: no trimming, no export, no sharing, no chapters. It's there because a transcript you can
click is the difference between a folder of videos and a folder you can search, and I wanted to
find out whether that's enough before building the rest.

## Two bugs I owed people

**Bluetooth headphones stuck in phone-call quality.** After a dictation on a Sony WH-1000XM5,
music stayed tinny until Kleoth was quit. Opening a microphone puts a headset into its hands-free
profile — every app does that — but the profile never released. The reason is a property of
`AVAudioEngine` that I could not find documented anywhere: an engine whose `inputNode` was
touched keeps the input device open until the *engine object is deallocated*. `stop()` does not
release it. An engine that was never started, only asked for its input format, pins the headset
at 16 kHz. Kleoth used one engine for the app's lifetime, so HFP lasted for the app's lifetime.
Now each capture builds an engine per session and frees it on every exit, and the headset is back
to full quality about a second after you let go of the hotkey. A fresh engine takes ~200 ms to
start on a headset instead of ~55 ms warm, so the pill now acknowledges the press before the
microphone opens and you don't feel it.

**A crash a few seconds after starting a dictation.** Five crash reports with the same signature,
all in the Swift concurrency runtime, all pointing at nothing in particular. The unified log five
seconds before each one had the actual cause: AVFoundation raising an Objective-C exception,
*Failed to create tap due to format mismatch*, because after the default input device changes
while an engine is idle, `inputNode.outputFormat(forBus:)` keeps the previous device's sample rate
forever while `inputFormat(forBus:)` follows the hardware. AppKit swallows the exception, the
unwinding skips the runtime's destructors, and the app dies on the next main-actor check. Two
fixes: read the input format, and route every AVFoundation call that can raise through a
one-function Objective-C bridge so it becomes a Swift error and a red pill instead of a delayed
crash. That bridge is a rule now, not a patch.

## Also in 0.3.0

- **Short dictations and chat messages are pasted as heard.** The LLM clean-up only runs when
  it earns its latency: under 24 words, or anything into a messenger, goes straight from Scribe
  to the paste, about a second sooner. A Settings toggle brings the old always-polish back.
- **The terminal mode from 0.2.0 is gone.** It kept every word on one line, which is right for a
  shell prompt and wrong for Claude Code, which lives in the same window. Terminals now get the
  same restructuring as editors; I wasn't going to dictate shell commands anyway.
- **External microphones work.** A headset mic runs at 16 kHz mono, where the AAC encoder caps
  at 48 kbps and refused the fixed bit rate Kleoth asked for. The bit rate now follows the
  encoder's own limit, and both captures survive the profile switch a headset does right after
  its mic opens.
- **Polish no longer times out on long prompts.** Installs that opened Settings on 0.2.0's release
  day had the slow interim model persisted; it migrates to the current default, the ceiling is
  30 s instead of 8, and Esc while polishing pastes the raw transcript immediately.
- **The pill is faster** — every rise, sink and hover peek runs in 0.2–0.35 s instead of half a
  second — and it answers the hotkey on the first frame. Its motion was rebuilt against a
  filmstrip: a headless sandbox renders each transition to PNG frames, which is how an AI agent
  and I reviewed animation without either of us watching the screen.
- Popover rows are clickable across their whole width, not just on the text.

## Rough edges

- Screen recording needs the **Screen Recording** permission, asked for the first time you start
  one. A self-signed identity turned out to be enough on macOS 26; I had expected to need a
  Developer ID and it's still on the list.
- The first on-device transcription after installing a new build takes about four minutes with
  no progress shown — Core ML re-specializes the Whisper model per binary. Every load after that
  takes a second or two. It looks stuck; it isn't.
- You cannot record Kleoth itself: its own windows are excluded from the frame as a whole.
- No trimming, sharing or export. No per-window recording, only a display or a region.
- Fragmented MP4 in Slack's and Telegram's inline players is untested.
- Still self-signed, still right-click → Open on first launch.

Download: [github.com/ofcRS/kleoth/releases/tag/v0.3.0](https://github.com/ofcRS/kleoth/releases/tag/v0.3.0).
Full notes in the [changelog](/changelog).
