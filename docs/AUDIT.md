# Yogufruti / West Side Tournament 2026 — audit

Reviewed November 1, 2026. The site is an English-language static GitHub Pages project. The original invitation confirms the West Side event at Yogufruti, Aguadilla, Puerto Rico, on Sunday, November 1. The medal is labeled **Finisher**; it is not presented as a first-place award.

## Verified checks

- 12 distinct initial songs; the official scoring fixture is **31,580 points**, maximum played chart **S23**.
- Every initial result resolves to a stable Pumpout song ID and a current matching Single chart in the Phoenix 2 v1.02.0 database.
- All 12 songs have locally stored, decodable WebP artwork, plus smaller table thumbnails. No artwork is hotlinked at runtime.
- All songs have artist, BPM, cut, category, main-series debut, Korean title and game song identifier where provided by the source. Current Singles/Doubles charts and chart-author credits are retained. The catalog contains 96 current Single/Double chart records across these 12 songs.
- A source manifest records URLs, database version, pinned repository commit, original/local hashes, file sizes, source dimensions and attribution notes.
- Group photo, original invitation and finisher medal are included. Individual profile images remain placeholders.

## Problems corrected

| Finding | Resolution |
| --- | --- |
| Only short song titles were used as identities | Attempts now use canonical external song IDs; "Vanish 2" resolves to "Vanish 2 - Roar of the invisible dragon". Original input titles are retained as searchable aliases. |
| No covers or song metadata | Added all 12 local covers and a searchable song catalog, with metadata and current chart lists in the detail dialog. |
| Non-Arcade and non-Single/Double records could be counted | Eligibility now rejects explicitly unsupported cuts and modes. |
| A known selection at or after 30:00 could be counted | Explicit selection times must be in the interval [0, 1800). A chart selected before the cutoff may finish later. |
| Deliberate abandonment and unapproved records could be counted | Explicit deliberate abandonment or failed verification excludes an attempt. |
| Missing identifiers could collapse into the same duplicate group | Counted attempts require an attempt, player and canonical song identifier. |
| Mobile score tables required horizontal scrolling | Scores reflow into compact cards with covers, chart, grade, machine score and points. The wider standings table retains horizontal scrolling. |

## Open data and capability gaps

| Priority | Gap | Current handling |
| --- | --- | --- |
| High | Original workbook and starter pack are unavailable locally | Initial results come from the handoff and six readable complete machine-result photos. Source workbook IDs must be reconciled before bulk imports. |
| High | Six machine scores and their complete judgments are absent | Shown as dashes. No guesses or derived machine scores. |
| High | Session selection times and pass/break status are unverified | Unknown fields remain unknown. Initial eligibility follows the handoff; all standings remain provisional. Explicit later disqualifications are supported. |
| Medium | Other players' names, individual images, locations and results are pending | Group photo is displayed; profiles use placeholders. Anonymous people are not assigned tags or invented points. |
| Medium | Spreadsheet import, persistent admin editing and shared uploads are not implemented | GitHub Pages is static. Future updates need an offline import-and-publish workflow or a separate authenticated backend. |
| Medium | Song duration, note counts and genre are not supplied by this database schema | Not inferred from BPM, chart level, play photos or filenames. |
| Low | Dream To Nightmare artwork is a legacy lower-resolution card | Uses the exact card referenced by the Phoenix database, kept at its original resolution without upscaling. |

## Validation and limits

`node tests/scoring.test.js` checks the official fixture, full S23 points, optional level cap, duplicate-song selection across charts, deterministic equal-point attempts, tied overall ranks, eligibility exclusions and the exact 30-minute boundary. `node tests/catalog.test.js` checks 12 unique catalog matches, played charts, metadata presence, local image format and SHA-256 integrity.

Automated browser access review rejected reopening the local preview during this update. The new layout and dialogs were reviewed in source and checked for asset/data integrity; the latest version has not received a completed visual browser check.
