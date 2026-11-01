# West Side Tournament 2026 — data audit

Reviewed November 1, 2026. Six players, 71 attempts, 61 identified songs, 512 current Single/Double chart records and 61 local covers. The source workbook and corrected NUMI CSV are recorded with SHA-256 hashes in `data/import-manifest.json`; inputs are read only.

## Reconciled standings

| Player | Points | Counted songs |
| --- | ---: | ---: |
| DIEGITOO113 | 31,580 | 12 |
| GHOST | 29,705 | 12 |
| SOYASAUCE | 25,365 | 11 |
| SPRADA | 23,930 | 12 |
| NUMI | 21,855 | 12 |
| MARCYS | 14,010 | 12 |

All imported attempt points equal the supplied source points. All five workbook totals match; NUMI's twelve CSV attempts total 21,855. Rankings remain provisional because timing and pass/break status are unverified; three SOYASAUCE song identities are also pending.

## Corrections and provenance

- Source “83” is B3, explicitly confirmed by the organizer; canonical ID `pumpout:1062`.
- GHOST, SPRADA and DIEGITOO113 portraits follow explicit organizer identification. Other profiles use initials. The group photo is not used to infer identities.
- Seven SOYASAUCE song identities were recovered by matching readable original result photos to exact scores and judgments. Three identities remain “Song N/A” with no fabricated cover.
- SOYASAUCE's final Ghost Bloody Train S15 result (995,092, SSS+) already exists as ATT-00059 and is not duplicated. The supplied workbook contains eleven SOYASAUCE attempts.
- NUMI's Pastry mix and Monkey Fingers attempts remain assigned to NUMI as explicitly confirmed in the corrected CSV, although the screenshots show SPRADA's game profile. This is retained in the result notes.
- NUMI's KUGUTSU alias uses the existing canonical song ID, preserving per-song deduplication.
- DIEGITOO113's Eternal Universe calories are 45.044 from the earlier readable photo; the workbook's 43.044 is retained as a documented discrepancy. Points are unaffected.

## Remaining gaps

| Gap | Handling |
| --- | --- |
| Three SOYASAUCE titles (SONG-0046, SONG-0047, SONG-0053) | N/A artwork/title; supplied points provisional until canonical identities and duplicates can be checked |
| SOYASAUCE 404 (New Era) machine score | N/A; grade and tournament points retained |
| Session selection times and pass/break status | Unverified; no inference from upload order |
| Three player portraits and missing player locations | Initials and N/A |
| Song duration and note count | Not supplied by this catalog; not fabricated |
| Dream To Nightmare cover resolution | Exact legacy card, no upscaling |

## Verification

`tests/scoring.test.js` checks every source point, player totals, duplicate-song selection across charts, equal-point tie handling, level and mode/cut eligibility, explicit abandonment, and the exact 30-minute boundary. `tests/catalog.test.js` checks all 61 unique catalog matches, played chart levels, metadata, local WebP files and SHA-256 integrity, profile hashes, and JSON/browser-data parity. The importer is deterministic for identical source inputs.

Browser access review rejected the local preview earlier in this session. This update was checked through source, data and asset validation; no completed fresh visual browser check is claimed. The layout retains the established mobile card view and responsive catalog.
