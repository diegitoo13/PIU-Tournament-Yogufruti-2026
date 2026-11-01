# Asset and metadata sources

Reviewed November 1, 2026. All runtime images are local WebP files. The source catalog is a community database, not an official tournament results source.

## Song catalog

- [Pumpout DB Updates](https://github.com/aaaaaa2493/pumpout-db-updates), commit `68d8cc356e585244b1dafd73a23b8c3386e6e31f`.
- [Phoenix 2 v1.02.0 SQLite database](https://github.com/aaaaaa2493/pumpout-db-updates/releases/download/Phoenix-2-1.02/pumpout-phoenix-2-1.02.db).
- Database SHA-256: `359d69d5fac896c612ef517dca77caa54e8bff242692de9bce9a8a856a90a726`.
- The pinned repository tree contains no license file. Artwork rights remain with ANDAMIRO, the respective song artists and other rights holders; no open artwork license is asserted. The site uses covers to identify the corresponding songs. No audio or music video files are distributed.

## Downloaded artwork

| Song | Source | Local cover | Source dimensions | Local bytes |
| --- | --- | --- | --- | --- |
| Eternal Universe | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Eternal_Universe.png) | `assets/songs/1033-cover.webp` | 1920 × 1080 | 73,754 |
| Curiosity Overdrive | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Curiosity_Overdrive.png) | `assets/songs/947-cover.webp` | 1280 × 720 | 78,110 |
| We Love Your Step | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_We_Love_Your_Step.png) | `assets/songs/1082-cover.webp` | 1920 × 1080 | 73,704 |
| Solve My Hurt | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Solve_My_Hurt.png) | `assets/songs/1032-cover.webp` | 1920 × 1080 | 23,388 |
| Vanish 2 - Roar of the invisible dragon | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Vanish_2___Roar_of_the_invisible_dragon.png) | `assets/songs/1030-cover.webp` | 1920 × 1080 | 57,988 |
| Burn Out | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Burn_Out.png) | `assets/songs/1024-cover.webp` | 1920 × 1080 | 29,750 |
| Bluish Rose | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Bluish_Rose.png) | `assets/songs/952-cover.webp` | 1280 × 720 | 42,470 |
| Dream To Nightmare | [Source](https://pumpout.anyhowstep.com/img/card/135.png) | `assets/songs/208-cover.webp` | 250 × 188 | 13,970 |
| Ghost Bloody Train | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_Ghost_Bloody_Train.png) | `assets/songs/1102-cover.webp` | 1920 × 1080 | 80,862 |
| Super Akuma Emperor | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Super_Akuma_Emperor.png) | `assets/songs/1022-cover.webp` | 1920 × 1080 | 40,212 |
| Break Through Myself | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix_Break_Through_Myself.png) | `assets/songs/1007-cover.webp` | 1920 × 1080 | 39,198 |
| OVERNIGHT FLOWER | [Source](https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/68d8cc356e585244b1dafd73a23b8c3386e6e31f/img_big/Phoenix2_OVERNIGHT_FLOWER.png) | `assets/songs/1065-cover.webp` | 1920 × 1080 | 45,724 |

Source originals are kept in the task’s working area. `data/asset-sources.json` stores the original and local SHA-256 hashes. Each song has a cover and a smaller thumbnail; image proportions are preserved. Dream To Nightmare uses the exact legacy `/img/card/135.png` card referenced by this Phoenix database and is not upscaled.

## User-supplied event media

| Image | Local file | Usage |
| --- | --- | --- |
| Player group photo | `assets/event/participants.webp` | Group gallery; no facial identification or automatic name assignment |
| Finisher medal | `assets/event/finisher-medal.webp` | Finisher medal image; not a ranking trophy |
| Original invitation | `assets/event/invitation.webp` | Event invitation and confirmation of venue/date/name |

`data/event-assets.json` records source and derivative hashes. These three assets were provided by the user for this site.

## Title aliases and missing metadata

- Input “Vanish 2” maps to catalog ID `pumpout:1030`, “Vanish 2 - Roar of the invisible dragon”.
- Input “Break Through Myself feat. Risa Yuzuki” maps to `pumpout:1007`, catalog title “Break Through Myself”; Risa Yuzuki remains in the artist credit.
- No ambiguous song match remains among the 12 initial results.
- No duration, note count, exact play time or player location is inferred.
