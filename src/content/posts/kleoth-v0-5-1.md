---
title: 'kleoth v0.5.1'
description: 'Kleoth 0.5.1 — release notes.'
date: 2026-09-27
tags: ['kleoth', 'release']
tool: 'kleoth'
draft: true
---

**[Kleoth 0.5.1](https://github.com/ofcRS/kleoth/releases/tag/v0.5.1)** is out.

## Install

Download **Kleoth-0.5.1.dmg** (8.3 MB), open it, and drag Kleoth.app onto Applications. Builds are self-signed, not notarized, so macOS blocks the first launch once. On macOS 15 or later, click **Done**, then System Settings → Privacy & Security → **Open Anyway**. On macOS 14, right-click Kleoth.app → **Open**.

SHA-256: `70fafe5d9aeca378561204baf35a1f4cc39aa6a1d7b0b03bdaf8095f87d4593f`

Upgrading from 0.5.0: just replace the app. Your data in `~/Kleoth` and your keys in the Keychain are untouched.

### Added

- **Dictation fits the text you're dictating into.** Speak a correction or an addition over a
  selection and the two come back as one piece in its place: nothing outside it changes, and one
  ⌘Z (or History) brings the original back. At the cursor, your words continue the sentence; short
  mid-sentence dictations are now cleaned up too (not in messengers). A terminal selection is only
  a spelling reference. A selection of 4,000 to 20,000 characters, or one the cleanup failed on,
  stays as it was with the dictation after it; an unreadable or longer one is replaced as before.
- **What dictation reads from the field you dictate into, and where it goes.** When you press
  fn+shift, Kleoth only asks the app what kind of field has focus. When you release, it reads that
  one field: the selection, and up to 1,500 characters before and 500 after the cursor or
  selection. It sends them, with your words, to the AI provider that already cleans those up, and
  only when that is OpenRouter or Claude Code; a local server and Apple's on-device model get your
  words alone, and a selection then keeps the dictation after it. Password fields and password
  managers (1Password, Bitwarden, Passwords, Keychain Access) are never read. The text around the
  cursor is never stored. It's on by default; turn off **Use the text you're dictating into** in
  Settings → Dictation to read nothing (stored as `dictation_context`: `"false"`).
- **Meetings from the pill.** Hover the pill: the dock now has four fields — Dictate · Meeting ·
  Screen · More ("Record" is now "Screen", now that two fields record). **Meeting** starts a
  meeting recording exactly like Start Recording in the menu bar, and the pill's menu has **Record
  meeting**, or **Stop meeting recording** while one runs. While a meeting records — started from
  the pill, the menu bar, the global hotkey or a `kleoth://` link, even with dictation off or the
  pill hidden for an hour — the pill is its control bar: elapsed time, a microphone and a
  system-audio meter, and **Stop**. A system meter that stays flat while others talk is the sign that
  System Audio Recording isn't allowed. Once the meeting is saved, the pill says "Meeting saved ·
  12:03" for a few seconds; click it to open the meeting in History. Dictating during a meeting
  works as before and the bar comes back afterwards; a screen recording started during a meeting
  takes the bar over until it ends. With the bigger dock, a pill parked near a corner sits a little
  further from it, so the dock comes out without the pill shifting.
- **Calls that ask to be recorded (off by default).** Turn on **Offer to record calls** in
  Settings → Meetings and, when Zoom, Teams, a Slack huddle, FaceTime, Google Meet in a browser or
  another app starts using the microphone, the pill asks "Zoom call — record it?" with **Record**,
  **Never for Zoom** and ✕ (with calendar access, "“Weekly sync” on Zoom — record it?"). Nothing is
  recorded until you click Record, and the seconds before the click are not captured. ✕, or no
  answer for 30 seconds, means not for this call: no second offer while it lasts, nor for that app
  within 10 minutes. An offer never appears during a meeting or a screen recording, waits while you
  dictate, and never pulls the dock out from under the pointer. When the call app lets go of the
  microphone during a meeting, the pill suggests stopping once, 20 seconds later ("Zoom released the
  mic — stop recording?"); Kleoth never stops a recording on its own. Settings → Meetings lists
  every "Never for …" with **Remove**. Kleoth only notices which apps are using the microphone: no
  audio is read, no permission is asked for, and nothing leaves your Mac. With Screen Recording or
  Accessibility already allowed, it reads the call window's title to tell a Meet tab from other
  sites; a title that names no meeting is never saved.
- **Every meeting remembers where it happened.** A meeting now gets its `meta.json` the moment it
  stops, transcribed or not, and whether call detection is on or off. An untranscribed recording
  is named after its calendar event (with calendar access) or "Recording · Zoom · Sep 24, 14:05",
  can be renamed right away, and keeps where it happened, through transcription: the app, the
  service (Zoom, Google Meet…), how you started the recording, the calendar event, and a window
  title only when it named a meeting. All of it is read on your Mac and kept in that file; the
  event's title and attendees also go to your AI provider with the transcript, for the summary. When
  the calendar event had exactly one other person in it, the other side of the transcript is named
  after them instead of "Them"; renaming the speaker still wins.

### Changed

- **Meeting covers, full width.** A cover now runs across the top of the meeting page — the whole
  width, cropped to a wide band — with the title and the TL;DR under it; as you scroll, the picture
  slides a little slower than the page. Click the cover to see it full size (the Quick Look panel;
  Esc closes it). Right-click it, or use the `…` button in its corner, for **New Cover**, **Remove
  Cover** and **Show in Finder**. A summarized meeting without a picture shows a **Draw Cover** chip
  beside its other details ("No cover" when the meeting looked personal, "Cover failed" with the
  reason and **Try Again**). The whole page now scrolls as one, the audio player included, and the
  TL;DR is no longer repeated as the summary's first card. History rows show a bigger thumbnail,
  only on meetings that have a cover or are getting one. With Reduce Motion on, the picture scrolls
  with the page.
- **Scenes lean abstract.** The scene written for a cover now leaves out photos, picture frames,
  posters, paintings and mirrors, even when the meeting is about them: a picture inside the picture
  invited faces and lettering, and often came out blank. It also pictures the meeting's topic as
  one physical metaphor — something joined, balanced, mended or carried across, in the meeting's
  own world — rather than a re-staged meeting room.

### Fixed

- **Telegram Desktop messages were restructured like prompts.** Kleoth knew Telegram for macOS and
  Telegram Desktop's Linux id, but not its Mac one, so long messages got an editor's full rework.
  Telegram Desktop now gets the light touch of the other messengers: pasted as heard at the cursor
  (unless "Also clean up short dictations and chat messages" is on), and a merged selection keeps
  its wording and your voice.
- **`\/` in meeting and dictation files.** `cover.json`, `meta.json`, the other meeting files and
  the dictation day files wrote every `/` as `\/`, so a model name read `z-ai\/glm-5.3-flash`. They are
  written plainly now; files written before still read fine.
- **A leftover `.cover-…tmp` file.** A crash or a force quit at the instant a cover was being
  saved could leave that hidden temp file in the meeting folder for good. Once it is an hour old it
  is now removed at the next launch, or before the next cover is saved there.
- **On-device meeting transcripts came out as a few long blocks.** A meeting transcribed on device
  showed each side in one or two long paragraphs — most of what you said, then most of what the
  other person said — sometimes with a "Thank you." nobody said. The words and who said them were
  right; the order of the turns was lost. Whisper's own timestamps stretch each sentence over the
  silence after it, so the transcript never saw where anyone stopped. The on-device engine now
  times each stretch of speech by its words, as it already did for screen recordings, and a new
  turn starts wherever the other side spoke in the pause, even for a one-word "Sure." in a quick
  exchange (a reply that talks over you keeps your turn whole). The "Thank you." Whisper made up
  in a silence goes too: timing by words drops a sentence with no speech under it. Transcribing
  takes about as long as before. Cloud (Scribe) transcripts are unchanged. A meeting transcribed
  on device before this keeps its old blocks until it is transcribed again: **Remove
  transcription**, then **Transcribe**.


<!-- draft: edit me, set draft: false, merge to publish -->
