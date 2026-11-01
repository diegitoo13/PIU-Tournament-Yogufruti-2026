# West Side Tournament 2026 — Yogufruti PIU scoreboard

English-language static scoreboard for the November 1, 2026 Pump It Up event at Yogufruti in Aguadilla, Puerto Rico. Built for GitHub Pages, with no runtime dependencies or build step.

## Run and publish

Run `python3 -m http.server 8000` in this directory, then open `http://localhost:8000`. To publish, push the files to GitHub and select the appropriate branch and `/ (root)` in **Settings → Pages**. All paths are relative, including images, so project subpaths are supported. `.nojekyll` disables unnecessary Jekyll processing. The custom domain is `piu.kazza.jp`; the root `CNAME` file preserves it when GitHub Pages publishes from the branch.

## Included

- Provisional official standings, calculated from the best eligible points per player and song.
- Searchable result table that reflows into cards on mobile; combined level/mode filters, sorting and shareable filter query parameters.
- Score details with the tournament calculation, judgments and available machine score.
- Player details and placeholders for pending profile data.
- Twelve local song covers and a searchable catalog containing title, artist, BPM, Korean title, game identifier, cut, category, main-series debut, current charts and chart authors.
- User-supplied player group photo, invitation and finisher medal.

The original invitation and medal identify the event as **West Side Tournament**. The existing Yogufruti project name and repository are preserved.

## Tests

```sh
node tests/scoring.test.js
node tests/catalog.test.js
node --check app.js
```

The scoring fixture must remain 12 counted songs, 31,580 points and maximum S23. See [the audit](docs/AUDIT.md) for findings, corrections and remaining gaps.

## Data and scoring

`data/results.js` is the current provisional seed; `data/catalog.js` is the browser catalog and `data/catalog.json` is its portable JSON counterpart. `scoring.js` handles eligibility, points, per-song deduplication and tied standings. The event's minimum/maximum difficulty and selection window are configurable. A null maximum means uncapped. Unknown timing and pass/break fields remain unverified, and initial eligibility follows the supplied handoff.

The complete workbook and starter pack are still needed to reconcile their stable IDs and fill six missing machine scores and judgment sets. The site does not currently import Excel, save admin edits or upload images. GitHub Pages can host an offline import-and-publish workflow; persistent shared administration requires a separate backend. Do not add a password in browser JavaScript and claim it protects administrative actions.

## Rebuild song metadata and covers

`scripts/import_catalog.py` reads the Phoenix 2 v1.02.0 SQLite schema and selects the latest applicable records along its version ancestry, excluding removed charts. It matches explicit song IDs, never guesses artwork filenames from titles. Input is a local source directory containing `phoenix-2-1.02.db` and the exact card files listed in the database. Install Pillow in a virtual environment, then run:

```sh
python scripts/import_catalog.py /absolute/path/to/source-directory
```

The source is [Pumpout DB Updates](https://github.com/aaaaaa2493/pumpout-db-updates), pinned to commit `68d8cc356e585244b1dafd73a23b8c3386e6e31f`; Dream To Nightmare uses its legacy Pump Out card. Source files, URLs, attribution and hashes are recorded in [the asset inventory](docs/ASSET_SOURCES.md) and `data/asset-sources.json`. Artwork remains with its respective rights holders; no open artwork license is asserted.

## Missing fields

Missing values are displayed as placeholders. The group photo is not used to infer names, home towns or player results. Individual images and gamer tags can be attached later. No song duration, note count or game timestamp is invented.
