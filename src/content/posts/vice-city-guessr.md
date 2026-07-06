---
title: 'Vice City Guessr — a GeoGuessr for a game I couldn''t run'
description: 'A GeoGuessr for GTA Vice City, built without running the game — I pulled the map out of the PC files and rendered the street views in headless Blender on a rented GPU.'
date: 2026-07-06
tags: ['gamedev', 'blender', 'gta']
---

I made a GeoGuessr for Grand Theft Auto: Vice City. It drops you on a random street, gives you a
360° view, and you pin where you think you are on the map. Five rounds, closer is better, and
there's a daily challenge with a leaderboard. Play it at [shck.dev/vc](/vc/).

The catch: I never ran the game. I had the PC version's files in a folder and a machine that
wouldn't run a 2002 DirectX game, so everything here came out of those files, offline.

## Getting the map out

Vice City keeps almost everything in one archive — `gta3.img`, a flat bundle of models,
textures, and the coordinates that place them in the world. I wrote a small parser for the
archive format and for the RenderWare texture files (`.txd`) inside it, and pulled out the
pieces I needed.

The guess map came almost for free. The in-game radar is an 8×8 grid of texture tiles; stitched
together they make a clean top-down map of the whole city. I lined it up against the world
coordinates the game uses — the playable area runs from -2048 to 2048 on each axis — so a click
on the map converts to a real in-world position, and back.

## There are no screenshots

A GeoGuessr needs street-level views, and I couldn't drive around taking them. So I rendered
them.

I loaded the city into Blender headless with [DragonFF](https://github.com/Parik27/DragonFF),
which reads RenderWare models, put a camera at eye height on the street, and rendered a full
360° panorama — an equirectangular image, the projection a panorama viewer expects. To find the
ground I raycast straight down at each spot and set the camera 1.7 m above where it hit.

![An equirectangular panorama rendered from the game geometry.](/img/vice-city-guessr/panorama.jpg)

Rendering the whole set on a CPU would have taken days, so I rented a GPU box, rendered on it,
and deleted it when the batch finished. The run cost about $45.

One honest note: these are renders of the game's geometry, not screenshots of the game. Same
models, same textures, lit by hand. Up close it shows.

## Getting the light right

The first renders were flat. Default lighting, no real sky, and color management that left
everything washed out under a grey haze — it looked like fog, not Miami.

![First pass — flat lighting and a washed-out haze, no real sky.](/img/vice-city-guessr/render-before.jpg)

The fix was scene setup, not the models. I gave the scene a sunset sky, dropped a water plane at
the coastline so the shore reads as ocean, and changed the color management so it stopped
desaturating everything to that milky pink. Same geometry, same camera — it just needed to be
lit.

![After — a sunset sky, an ocean, and a view transform that keeps the colour.](/img/vice-city-guessr/render-after.jpg)

## Picking where to stand

My first attempt placed cameras by jittering positions near buildings. Half of them ended up on
rooftops or inside walls.

The fix was already in the files. The game ships the paths that traffic and pedestrians follow —
a graph of nodes that are, by definition, standing on a street. I used those as the camera
spots, which got me 197 street-level views that all look like somewhere you could actually be.

![The game: a rendered street on the left, the guess map in the corner.](/img/vice-city-guessr/play.jpg)

## The game

Two modes. Practice is endless and scored on the spot. The daily challenge gives everyone the
same five spots and ranks them.

"The same five" has to be deterministic without a database of pre-baked days, so I hash the date
into a seed, seed a small PRNG with it, and shuffle the spot pool. Every player on a given day
derives the identical five rounds from the date alone.

Each round scores `5000 · e^(−distance/450)` — full marks for a bullseye, decaying with how far
off you are, near zero across the map. The daily scores on the server, and the answer
coordinates never reach the browser until you've locked in a guess, so you can't read them out
of the page. The leaderboard is one SQLite table.

## Shipping it next to the blog

The game lives at `shck.dev/vc`, on the same server as this blog. I didn't want its config
anywhere near the blog's, so it runs as its own service behind a separate nginx include — the
blog config is left untouched. A deploy builds, pushes a timestamped release, flips a symlink to
it, health-checks the new release, and rolls back automatically if it doesn't answer.

## Rough edges

- The panoramas are rendered, not real. It's the game's geometry, and it looks like it.
- 197 spots covers the city, but not every corner of it.
- The world is frozen at one time of day and one weather. No night, no rain.
- A few interiors and far-out spots didn't render cleanly and got cut.

Play it: [shck.dev/vc](/vc/).
