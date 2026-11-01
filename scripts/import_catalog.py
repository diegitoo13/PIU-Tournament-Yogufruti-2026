"""Build the site's mapped song catalog from a local Pumpout Phoenix 2 v1.02 DB.
Usage: python3 scripts/import_catalog.py /absolute/path/to/source-directory
The directory must contain phoenix-2-1.02.db and the exact card filenames.
Requires Pillow for web image optimization. Network fetching is intentionally separate.
"""
import hashlib
import json
import sqlite3
import sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1]).resolve()
DB = SOURCE / 'phoenix-2-1.02.db'
COMMIT = '68d8cc356e585244b1dafd73a23b8c3386e6e31f'
REPO = 'https://github.com/aaaaaa2493/pumpout-db-updates'
VERSION = 202
IDS = list(dict.fromkeys(value for value in json.loads((ROOT/'data/workbook-song-map.json').read_text()).values() if value is not None))
CARD_SOURCES = json.loads((SOURCE/'card_sources.json').read_text()) if (SOURCE/'card_sources.json').exists() else {}
DATE = '2026-11-01'
c = sqlite3.connect(DB)
c.row_factory = sqlite3.Row
ancestors = {r[0] for r in c.execute('SELECT ancestorId FROM _derived_versionAncestor WHERE versionId=?', (VERSION,))}
version_order = {r['versionId']: r['sortOrder'] for r in c.execute('SELECT * FROM version')}

def rows(sql, params=()):
    return [dict(r) for r in c.execute(sql, params)]

def latest(table, field, value):
    candidates = [r for r in rows(f'SELECT * FROM {table} WHERE {field}=?', (value,)) if r['versionId'] in ancestors]
    return max(candidates, key=lambda r: version_order[r['versionId']]) if candidates else None

def credit(records):
    return ' '.join(f"{r['prefix']} {r['name']}".strip() for r in records)

songs = []
assets = []
for song_id in IDS:
    song = rows('SELECT s.*, ct.internalTitle cut FROM song s JOIN cut ct USING(cutId) WHERE songId=?', (song_id,))[0]
    artist = credit(rows('SELECT a.internalTitle name,sa.prefix FROM songArtist sa JOIN artist a USING(artistId) WHERE songId=? ORDER BY sortOrder', (song_id,)))
    bpm_version = latest('songBpmVersion', 'songId', song_id)
    bpm = rows('SELECT bpmMin,bpmMax FROM songBpm WHERE songBpmId=?', (bpm_version['songBpmId'],))[0]
    category_version = latest('songCategoryVersion', 'songId', song_id)
    category = rows('SELECT cat.internalTitle FROM songCategory sc JOIN category cat USING(categoryId) WHERE songCategoryId=?', (category_version['songCategoryId'],))[0]['internalTitle'] if category_version else None
    editions = rows('SELECT m.internalTitle mix,v.internalTitle version,sv.operationId,v.versionId FROM songVersion sv JOIN version v USING(versionId) JOIN mix m USING(mixId) WHERE songId=? ORDER BY v.sortOrder', (song_id,))
    addition = next((r for r in editions if r['versionId'] in ancestors and r['operationId'] == 1), None)
    identifier_versions = [r for r in rows('SELECT * FROM songGameIdentifierVersion sgv JOIN songGameIdentifier sgi USING(songGameIdentifierId) WHERE sgi.songId=?', (song_id,)) if r['versionId'] in ancestors]
    identifier_version = max(identifier_versions, key=lambda r:version_order[r['versionId']]) if identifier_versions else None
    game_identifier = identifier_version['gameIdentifier'] if identifier_version and identifier_version['operationId'] != 2 else None
    korean_versions = [r for r in rows('SELECT * FROM songTitleVersion stv JOIN songTitle st USING(songTitleId) WHERE stv.songId=? AND stv.languageId=24', (song_id,)) if r['versionId'] in ancestors]
    korean_title = max(korean_versions, key=lambda r:version_order[r['versionId']])['title'] if korean_versions else None
    charts = []
    for chart in rows('SELECT chartId FROM chart WHERE songId=?', (song_id,)):
        chart_id = chart['chartId']
        state = latest('chartVersion', 'chartId', chart_id)
        if not state or state['operationId'] == 2:
            continue
        rating = latest('chartRatingVersion', 'chartId', chart_id)
        if not rating:
            continue
        spec = rows('SELECT m.internalTitle mode,d.value level FROM chartRating cr JOIN mode m USING(modeId) JOIN difficulty d USING(difficultyId) WHERE chartRatingId=?', (rating['chartRatingId'],))[0]
        if spec['mode'] not in ['Single', 'Double']:
            continue
        stepmaker = credit(rows('SELECT sm.internalTitle name,cs.prefix FROM chartStepmaker cs JOIN stepmaker sm USING(stepmakerId) WHERE chartId=? ORDER BY sortOrder', (chart_id,)))
        charts.append({'sourceChartId':chart_id, **spec, 'stepmaker':stepmaker or None})
    card = rows('SELECT path FROM songCard WHERE songId=? ORDER BY sortOrder LIMIT 1', (song_id,))[0]['path']
    filename = Path(card).name
    original = SOURCE / filename
    if not original.exists():
        raise RuntimeError(f'Missing artwork for {song_id}: {filename}')
    with Image.open(original) as image:
        image = ImageOps.exif_transpose(image).convert('RGB')
        width,height = image.size
        for size,label in [(320,'thumb'),(960,'cover')]:
            out=image.copy();out.thumbnail((size,size),Image.Resampling.LANCZOS)
            out.save(ROOT/f'assets/songs/{song_id}-{label}.webp', 'WEBP', quality=85, method=6)
    source_url = CARD_SOURCES.get(filename) or (('https://pumpout.anyhowstep.com'+card) if song_id == 208 else f'https://raw.githubusercontent.com/aaaaaa2493/pumpout-db-updates/{COMMIT}/img_big/{filename}')
    item = {'id':f'pumpout:{song_id}', 'sourceSongId':song_id, 'title':song['internalTitle'], 'koreanTitle':korean_title, 'gameIdentifier':game_identifier, 'artist':artist, **bpm, 'cut':song['cut'], 'category':category, 'mainSeriesDebut':f"{addition['mix']} {addition['version']}" if addition else None, 'catalogVersion':'Phoenix 2 v1.02.0', 'charts':charts, 'cover':f'assets/songs/{song_id}-cover.webp', 'thumbnail':f'assets/songs/{song_id}-thumb.webp', 'source':REPO, 'artworkSource':source_url, 'sourceCardPath':card, 'reviewedAt':DATE}
    songs.append(item)
    local = ROOT/item['cover']
    assets.append({'songId':item['id'],'title':item['title'],'sourceUrl':source_url,'sourceFilename':filename,'sourceSha256':hashlib.sha256(original.read_bytes()).hexdigest(),'sourceWidth':width,'sourceHeight':height,'localPath':item['cover'],'localSha256':hashlib.sha256(local.read_bytes()).hexdigest(),'localBytes':local.stat().st_size,'rights':'Artwork remains with ANDAMIRO / respective song artists and rights holders. No open artwork license asserted.','repositoryLicense':'No license file found in the pinned repository tree.','reviewedAt':DATE})

catalog = {'source':REPO,'sourceCommit':COMMIT,'databaseVersion':'Phoenix 2 v1.02.0','databaseSha256':hashlib.sha256(DB.read_bytes()).hexdigest(),'verifiedAt':DATE,'songs':songs}
(ROOT/'data/catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n')
(ROOT/'data/catalog.js').write_text('window.PHOENIX_CATALOG = '+json.dumps(catalog,ensure_ascii=False,indent=2)+';\n')
(ROOT/'data/asset-sources.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2)+'\n')
print(f'Built {len(songs)} songs, {sum(len(s["charts"]) for s in songs)} current Single/Double chart records and {len(assets)} local covers.')
