"""Import a normalized tournament workbook plus optional player CSV into the static site.
Read-only input files. Re-running with the same IDs produces the same output.
Usage: python scripts/import_results.py tournament.xlsx [additional-player.csv ...]
Requires openpyxl. Song identities are reviewed in data/workbook-song-map.json.
"""
import csv
import hashlib
import json
import re
import sys
from collections import Counter
from pathlib import Path
from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
workbook_path = Path(sys.argv[1]).resolve()
csv_paths = [Path(arg).resolve() for arg in sys.argv[2:]]
workbook = load_workbook(workbook_path, read_only=True, data_only=True)

def table(name):
    headers = None
    records = []
    for index, row in enumerate(workbook[name].iter_rows(values_only=True), start=1):
        if index == 6:
            headers = [str(value).strip() if value is not None else None for value in row]
        elif index > 6 and row and row[0]:
            records.append({key: value for key, value in zip(headers, row) if key})
    return records

raw_players = table('Jugadores')
raw_songs = {record['song_id']: record for record in table('Canciones')}
raw_attempts = {record['attempt_id']: record for record in table('Intentos')}
source_references = {
    row[0]: {'file':workbook_path.name, 'sheet':'Intentos', 'row':index, 'range':f'A{index}:AH{index}', 'judgmentRange':f'K{index}:O{index}'}
    for index, row in enumerate(workbook['Intentos'].iter_rows(values_only=True), start=1)
    if index > 6 and row and row[0]
}
expected_totals = {record['player_id']: record['puntos_totales'] for record in table('Ranking')}
for csv_path in csv_paths:
    for line, record in enumerate(csv.DictReader(csv_path.open(encoding='utf-8-sig', newline='')), start=2):
        for field in ['nivel','score_juego','perfect','great','good','bad','miss','combo_max','kcal','factor','puntos_base','puntos_intento','puntos_oficiales','seleccion_seg']:
            text = record.get(field)
            record[field] = float(text) if text not in [None,''] else None
            if record[field] is not None and record[field].is_integer():
                record[field] = int(record[field])
        raw_attempts[record['attempt_id']] = record
        source_references[record['attempt_id']] = {'file':csv_path.name, 'row':line}
        title = re.search(r'Título: (.*?)\. ', record.get('notas',''))
        title = record.get('titulo_cancion') or (title.group(1) if title else None)
        if record['song_id'] not in raw_songs and title:
            raw_songs[record['song_id']] = {'titulo_canonico': title}
    for player_id in sorted({record['player_id'] for record in raw_attempts.values()}):
        if not any(player['player_id'] == player_id for player in raw_players):
            player_names = {'PLY-0006':'NUMI', 'PLY-0007':'AZUAAAAO', 'PLY-0008':'THEJMAXX', 'PLY-0009':'SANTANA', 'PLY-0010':'YESIIITL', 'PLY-0011':'YXYZYXY'}
            if player_id not in player_names:
                raise ValueError(f'Unknown player {player_id}; add a confirmed profile first')
            name = player_names[player_id]
            raw_players.append({'player_id':player_id, 'gamer_tag':name, 'nombre_publico':name})

mapping = json.loads((ROOT/'data/workbook-song-map.json').read_text())
profiles = json.loads((ROOT/'data/player-profiles.json').read_text())
# Identities recovered by matching the readable source photos to the exact score/judgments.
recovered_titles = {'SONG-0048':'Catastrophe','SONG-0049':'Hercules','SONG-0050':'Little Munchkin','SONG-0051':'Mephitz','SONG-0052':'Destr0yer','SONG-0054':'404 (New Era)','SONG-0055':'The Stranger','SONG-0032':'B3'}
players = []
for player in raw_players:
    player_id = player['player_id']
    players.append({
        'id':player_id, 'name':player['gamer_tag'], 'publicName':player.get('nombre_publico') or '',
        'location':player.get('pueblo') or '', 'country':player.get('pais') or '',
        'photo':profiles.get(player_id,{}).get('photo',''),
        'photoPosition':profiles.get(player_id,{}).get('photoPosition','50% 50%'),
    })

results = []
for raw in raw_attempts.values():
    source_song_id = raw['song_id']
    source_id = mapping.get(source_song_id)
    title = recovered_titles.get(source_song_id, raw_songs[source_song_id]['titulo_canonico'])
    if source_id is None:
        title = 'Song N/A'
    result = {
        'id':raw['attempt_id'], 'player':raw['player_id'], 'sourceSongId':source_id,
        'songId':f'pumpout:{source_id}' if source_id is not None else f'workbook:{source_song_id}',
        'sourceSongKey':source_song_id, 'sourceChartKey':raw['chart_id'],
        'song':title, 'mode':{'S':'Single','D':'Double'}[raw['modo']],
        'level':raw['nivel'], 'score':raw['score_juego'], 'grade':raw['calificacion'],
        'perfect':raw.get('perfect'), 'great':raw.get('great'), 'good':raw.get('good'),
        'bad':raw.get('bad'), 'miss':raw.get('miss'), 'combo':raw.get('combo_max'), 'kcal':raw.get('kcal'),
        'performance':raw.get('etiqueta_resultado') or None,
        'passStatus':'Unverified' if raw.get('pass_break') == 'No verificado' else raw.get('pass_break'),
        'cut':'Arcade' if raw['tipo_cancion'] == 'Arcade normal' else raw['tipo_cancion'],
        'valid':raw['validado']=='Sí' and raw['elegible']=='Sí',
        'selectionSecond':raw.get('seleccion_seg'),
        'songIdentityVerified':source_id is not None,
        'sourcePoints':raw.get('puntos_intento'), 'sourceEvidence':raw.get('foto_evidencia'),
        'verification':'Player workbook' if source_references[raw['attempt_id']].get('sheet') else 'Player CSV',
        'sourceReference':source_references[raw['attempt_id']],
        'reviewNote':None,
    }
    if not result['songIdentityVerified']:
        result['reviewNote']='Song title is not recoverable because the source photo is unavailable. Recorded as Song N/A; points follow the supplied workbook.'
    elif raw['player_id']=='PLY-0006' and raw['attempt_id'] in ['ATT-00068','ATT-00069']:
        result['reviewNote']='Assigned to NUMI by participant confirmation, although the source screenshot shows SPRADA’s game profile.'
    elif raw['player_id']=='PLY-0011' and raw['attempt_id'] in ['ATT-00120','ATT-00121']:
        result['reviewNote']='Source history capture shows 2026-11-02 08:16 (GMT+9), equivalent to 2026-11-01 19:16 in Puerto Rico. Confirm the tournament timing before officializing.'
    elif raw['attempt_id']=='ATT-00132':
        result['reviewNote']='Confirmed by the organizer as SOYASAUCE’s missing twelfth chart. The capture is partial: S16 is plausible and the chart exists, but the level is not legible in the photo (the green 18 is the timer) and the nick, judgments, combo and calories are blurry. Points follow the supplied Lv. 16 SSS+ estimate.'
    if raw['player_id']=='PLY-0001' and source_id==1033:
        result['reviewNote']='Calories follow the latest workbook: 43.044. An earlier photo transcription recorded 45.044; the workbook is the current source of record.'
    results.append(result)

manifest = {
    'workbook': {'file':workbook_path.name, 'sha256':hashlib.sha256(workbook_path.read_bytes()).hexdigest()},
    'additionalCsvs':[{'file':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()} for path in csv_paths],
    'importDate':'2026-11-01', 'playerCount':len(players), 'attemptCount':len(results),
    'resultCounts':dict(Counter(result['player'] for result in results)),
    'expectedWorkbookTotals':expected_totals,
    'unresolvedSongKeys':sorted({result['sourceSongKey'] for result in results if not result['songIdentityVerified']}),
    'corrections':['SPRADA photo identified explicitly by organizer','83 corrected to B3 by organizer','Ghost Bloody Train 995092 is already ATT-00059; not duplicated','Readable SOYASAUCE photos used to recover seven song identities','NUMI KUGUTSU source alias shares the canonical song ID with the existing catalog','THEJMAXX profile photo supplied by the organizer (tjmaxx)','F(R)IEND matched to Friend through the database song-title table','Because of You matched to the Becouse of You database spelling','SOYASAUCE Doppelganger S16 supplied as a partial capture and confirmed by the organizer as the missing twelfth chart'],
}
data = {'event':{'id':'yogufruti-2026','sourceEventId':'PIU-PR-2026-11-01','title':'West Side Tournament 2026','location':'Aguadilla, Puerto Rico','date':'2026-11-01','status':'complete','minLevel':5,'maxLevel':23,'sessionSeconds':1800},'players':players,'results':results}
(ROOT/'data/results.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
(ROOT/'data/results.js').write_text('window.TOURNAMENT_DATA = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n')
(ROOT/'data/import-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(f'Imported {len(players)} players and {len(results)} attempts; unresolved song identities: {len(manifest["unresolvedSongKeys"])}.')
