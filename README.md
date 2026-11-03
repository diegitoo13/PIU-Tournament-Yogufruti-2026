# West Side Tournament 2026 — Yogufruti PIU scoreboard

English static scoreboard for the November 1, 2026 Pump It Up event at Yogufruti in Aguadilla, Puerto Rico. Live at https://piu.kazza.jp. GitHub Pages serves `main` from the repository root; no build step or runtime dependencies.

## Run and validate

```sh
python3 -m http.server 8000
node tests/scoring.test.js
node tests/catalog.test.js
node tests/result-display.test.js
node tests/rewind.test.js
node tests/rewind-display.test.js
node --check app.js
```

The site contains eleven players and 132 attempts, 98 identified songs with local covers and 833 current Single/Double chart records. Standings count the best eligible tournament points per player and canonical song. Search, player/level/mode filters and sorting persist in shareable URLs. Score tables reflow into cards on mobile. Five confirmed profile photos and the supplied event photos are included.

## Import results

Install `openpyxl`, then run the read-only importer:

```sh
python scripts/import_results.py /absolute/path/to/tournament.xlsx /absolute/path/to/numi.csv /absolute/path/to/azua.csv
```

It reads the normalized workbook tables (headers on row 6), upserts the optional CSVs by attempt ID, and writes portable `data/results.json`, browser `data/results.js`, and an input hash manifest. The current inputs are `Torneo_PIU_2026_Resultados_5_Jugadores.xlsx` and `PIU_2026_Intentos_NUMI_12_corregidos.csv`, and `AZUAAAAO_12_canciones_datos_completos.csv`, and `PIU_2026_THEJMAXX_SANTANA_12_canciones_cada_uno.csv`, and `PIU_2026_YESIIITL_12_canciones_datos_completos.csv`, and `PIU_2026_YXYZYXY_12_canciones_completas.csv`, and `PIU_2026_SOYASAUCE_Doppelganger_S16_corregido.csv` (normalized from the organizer-supplied partial capture). Source files are not modified or published. `data/workbook-song-map.json` contains reviewed canonical song mappings; `data/player-profiles.json` contains confirmed profile overrides. Review new mappings and player IDs before importing a different tournament.

`scoring.js` handles grade factors, Lv. 5–23 eligibility, best-per-song deduplication and tied ranks. The 3,680-point maximum applies to one song; the session total sums all eligible unique songs selected before 30:00, with no fixed song-count limit. The tests reconcile every imported attempt's points and all five workbook totals plus supplied CSV points, with NUMI's 21,855-point, AZUAAAAO's 11,075-point, THEJMAXX's 33,020-point, SANTANA's 22,575-point, YESIIITL's 15,640-point and YXYZYXY's 10,835-point totals. SOYASAUCE rises to 27,845 points with the organizer-confirmed twelfth chart. DIEGITOO113 remains at 31,580 points, including full S23 points. Do not infer eligibility or game timing from image filenames or upload order.

## Validate source data

Run `python scripts/validate_results.py` with the same workbook and CSV arguments used for the import. It compares player, song and chart IDs, grades, judgments, scores, calories and source points against every source row, recording the outcome in `data/validation.json`. Result details identify the source file and row. Song details include each recorded player result and judgment counts.

## Missing data

SOYASAUCE has twelve supplied attempts: the twelfth is the organizer-confirmed partial Doppelganger S16 capture (ATT-00132), whose chart level is plausible but not legible in the photo; its judgments, combo and calories stay N/A. The final Ghost Bloody Train photo is already recorded as ATT-00059. Three song identities remain N/A; their supplied points are provisional pending identity and duplicate review. One machine score is unreadable. Missing values are shown as N/A; unverified timing and pass/break status remain explicit. YXYZYXY’s earliest captures carry a GMT+9 timestamp that must be confirmed against the tournament window before results are official. Other player portraits use initials. No location, duration, note count or exact timestamp is invented. See `docs/AUDIT.md`.

## Rebuild metadata and covers

Install Pillow and run:

```sh
python scripts/import_catalog.py /absolute/path/to/source-directory
```

The directory contains `phoenix-2-1.02.db`, exact database card filenames and optionally `card_sources.json` with their verified URLs. The script selects current charts along the Phoenix 2 v1.02.0 version ancestry and creates optimized local covers and thumbnails. The database and images come from [Pumpout DB Updates](https://github.com/aaaaaa2493/pumpout-db-updates), pinned to commit `68d8cc356e585244b1dafd73a23b8c3386e6e31f`; Dream To Nightmare uses its exact legacy Pump Out card. Attribution and hashes are in `data/asset-sources.json` and `docs/ASSET_SOURCES.md`.

## Publishing and domain

Commit and push to `main` to deploy. `.nojekyll` disables Jekyll; `CNAME` preserves `piu.kazza.jp`. DNS uses only the `piu` subdomain CNAME pointing to `diegitoo13.github.io`. Existing root-domain and other subdomain records are unchanged. The site is static; editing shared results or uploading new data requires the offline import-and-publish workflow or a separate authenticated backend.

## Tournament Rewind

Open `/rewind.html` for seven tournament stories or select any player for their personal recap. Navigation supports buttons, keyboard arrows (with the story focused), and touch swipes. Download the current frame as a 1080 × 1920 PNG, or use native file sharing where available. Each export includes the provisional status and snapshot date/time. No server, external rendering service, font dependency, or generated artwork is used.

The page fetches the current `data/results.json` and `data/catalog.json` on load and on **Regenerate with latest results**, bypassing the browser cache. Publish new imports normally; no recap assets need rebuilding. Existing downloaded images are immutable snapshots. A player can be linked with `rewind.html?player=PLY-0001`.

`rewind-data.js` uses the same `scoring.js` eligibility and best-per-song logic as standings. Grade, mode, judgment, song popularity, and combo statistics use counted plays. Song popularity excludes unresolved identities. Perfect share is calculated only from records containing all five judgments, and is not official game accuracy. Tied best plays are labeled; one representative artwork is shown. Rankings are provisional, including records whose timing or identity remains unverified.
