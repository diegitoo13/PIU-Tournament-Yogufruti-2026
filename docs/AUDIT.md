# West Side Tournament 2026 — data audit

Reviewed November 2, 2026. Eleven players, 132 attempts, 98 identified songs, 833 current Single/Double chart records and 98 local covers. The source workbook, corrected NUMI CSV, AZUAAAAO CSV, THEJMAXX/SANTANA CSV, YESIIITL CSV, YXYZYXY CSV and the corrected SOYASAUCE Doppelganger S16 CSV are recorded with SHA-256 hashes in `data/import-manifest.json`; inputs are read only.

## Rule reconciliation

The organizer supplied the written rules again: minimum Lv. 5, maximum Lv. 23, normal Arcade, Single/Double equal scoring, best tournament points per player/song, and selection strictly before 30:00. The previous uncapped event configuration and page text were incorrect and are now corrected to Lv. 23. No submitted attempt exceeds Lv. 23, so all current totals remain unchanged.

All grade multipliers match the written table. The maximum is 3,680 per song; the minimum is 375. Session totals add counted songs and have no fixed song-count cap. All submitted attempts are distinct per player/song; the common twelve-song count comes from the supplied files. The highest submitted individual result is 3,100, below the per-song maximum. Selection times remain absent, so compliance with the session timer cannot be independently proven from these files.

## Reconciled standings

| Player | Points | Counted songs |
| --- | ---: | ---: |
| THEJMAXX | 33,020 | 12 |
| DIEGITOO113 | 31,580 | 12 |
| GHOST | 29,705 | 12 |
| SOYASAUCE | 27,845 | 12 |
| SPRADA | 23,930 | 12 |
| SANTANA | 22,575 | 12 |
| NUMI | 21,855 | 12 |
| YESIIITL | 15,640 | 12 |
| MARCYS | 14,010 | 12 |
| AZUAAAAO | 11,075 | 12 |
| YXYZYXY | 10,835 | 12 |

All imported attempt points equal the supplied source points. All five workbook totals reconcile with the CSV additions; NUMI's twelve CSV attempts total 21,855; AZUAAAAO's twelve total 11,075; THEJMAXX's twelve total 33,020; SANTANA's twelve total 22,575; YESIIITL's twelve total 15,640; YXYZYXY's twelve total 10,835. SOYASAUCE's workbook total of 25,365 plus the organizer-confirmed Doppelganger S16 capture (2,480) reaches 27,845. An independent row-level check compared 2,244 values and found no differences. 131 of 132 attempts contain Perfect, Great, Good, Bad and Miss counts; the Doppelganger S16 capture has no readable judgments, combo or calories, and only one machine score is unavailable. Rankings remain provisional because timing and pass/break status are unverified; three SOYASAUCE song identities are also pending.

## Corrections and provenance

- Source “83” is B3, explicitly confirmed by the organizer; canonical ID `pumpout:1062`.
- GHOST, SPRADA, DIEGITOO113, THEJMAXX and SANTANA portraits follow explicit organizer identification; THEJMAXX's photo was supplied as “tjmaxx”. Remaining profiles use initials. The group photo is not used to infer identities.
- Seven SOYASAUCE song identities were recovered by matching readable original result photos to exact scores and judgments. Three identities remain “Song N/A” with no fabricated cover.
- SOYASAUCE's final Ghost Bloody Train S15 result (995,092, SSS+) already exists as ATT-00059 and is not duplicated. The supplied workbook contains eleven SOYASAUCE attempts.
- NUMI's Pastry mix and Monkey Fingers attempts remain assigned to NUMI as explicitly confirmed in the corrected CSV, although the screenshots show SPRADA's game profile. This is retained in the result notes.
- THEJMAXX and SANTANA have twelve complete attempts each. Source alias SONG-0079 resolves to the existing Solve My Hurt catalog ID; Dement ~After Legend~ is verified by the database's song-title table as song 759.
- NUMI's KUGUTSU alias uses the existing canonical song ID, preserving per-song deduplication.
- DIEGITOO113's Eternal Universe calories follow the latest workbook at 43.044; the earlier photo transcription of 45.044 remains a documented discrepancy. Points are unaffected.
- Source alias SONG-0093 (“F(R)IEND”) resolves to Friend (`pumpout:798`), verified through the database's English song-title table; “Because of You” matches the database's “Becouse of You” spelling (`pumpout:1034`).
- SOYASAUCE's twelfth chart is the partial Doppelganger S16 capture (IMG_4206.jpeg), confirmed by the organizer as the missing attempt. The chart level is not legible in the photo (the green 18 is the timer), and the nick, judgments, combo and calories are blurry. Points follow the supplied Lv. 16 SSS+ estimate of 2,480; the caveats are recorded on the result.
- YXYZYXY's history-capture rows (ATT-00120, ATT-00121) show 2026-11-02 08:16 (GMT+9), equivalent to 2026-11-01 19:16 in Puerto Rico, and are flagged for timing confirmation before officializing.
- YESIIITL and YXYZYXY play order is not confirmable from the supplied captures; no order is inferred.

## Remaining gaps

| Gap | Handling |
| --- | --- |
| Three SOYASAUCE titles (SONG-0046, SONG-0047, SONG-0053) | N/A artwork/title; supplied points provisional until canonical identities and duplicates can be checked |
| SOYASAUCE 404 (New Era) machine score | N/A; grade and tournament points retained |
| Doppelganger S16 judgments, combo and calories (blurry capture) | N/A; grade and tournament points retained |
| Doppelganger S16 chart level | Not legible in the capture; the Lv. 16 SSS+ estimate is used on organizer confirmation and flagged on the result |
| YXYZYXY capture timestamp (GMT+9) | Flagged on the affected results; confirm the tournament timing before officializing |
| Session selection times and pass/break status | Unverified; no inference from upload order |
| Six player portraits and missing player locations | Initials and N/A |
| Song duration and note count | Not supplied by this catalog; not fabricated |
| Dream To Nightmare cover resolution | Exact legacy card, no upscaling |

## Verification

`tests/scoring.test.js` checks every source point, player totals, duplicate-song selection across charts, equal-point tie handling, level and mode/cut eligibility, explicit abandonment, and the exact 30-minute boundary. `tests/result-display.test.js` checks the judgment display and source references for all attempts. `tests/catalog.test.js` checks all 98 unique catalog matches, played chart levels, metadata, local WebP files and SHA-256 integrity, profile hashes, and JSON/browser-data parity. The importer is deterministic for identical source inputs.

Live result dialogs were checked on the public HTTPS site. OVERNIGHT FLOWER correctly showed Lv. 22, AAA and 2,420 points; the formula now explicitly labels the grade multiplier and appears above the metadata. Automated display checks cover all 132 attempts, including N/A rendering for unavailable values. The layout retains the established mobile card view and responsive catalog.
