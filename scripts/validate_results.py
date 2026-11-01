"""Read-only reconciliation of published results against the source workbook/CSV.
Usage: python scripts/validate_results.py tournament.xlsx [additional-player.csv ...]
Writes data/validation.json and exits unsuccessfully on any mismatch.
"""
import csv
import hashlib
import json
import sys
from pathlib import Path
from openpyxl import load_workbook

root = Path(__file__).resolve().parents[1]
workbook_path = Path(sys.argv[1]).resolve()
csv_paths = [Path(arg).resolve() for arg in sys.argv[2:]]
workbook = load_workbook(workbook_path, read_only=True, data_only=True)
rows = workbook['Intentos'].iter_rows(values_only=True)
for _ in range(5):
    next(rows)
headers = next(rows)
sources = {}
for row in rows:
    if row and row[0]:
        sources[row[0]] = dict(zip(headers, row))
for csv_path in csv_paths:
    with csv_path.open(encoding='utf-8-sig', newline='') as stream:
        for record in csv.DictReader(stream):
            sources[record['attempt_id']] = record

data = json.loads((root/'data/results.json').read_text())
numeric_fields = {
    'level':'nivel', 'score':'score_juego', 'perfect':'perfect', 'great':'great',
    'good':'good', 'bad':'bad', 'miss':'miss', 'combo':'combo_max', 'kcal':'kcal',
    'selectionSecond':'seleccion_seg', 'sourcePoints':'puntos_intento',
}
text_fields = {'player':'player_id', 'grade':'calificacion', 'sourceSongKey':'song_id', 'sourceChartKey':'chart_id'}
judgments = ['perfect','great','good','bad','miss']
machine_fields = ['score',*judgments,'combo','kcal']
differences = []
checks = 0
ids = [record['id'] for record in data['results']]
if len(set(ids)) != len(ids) or set(ids) != set(sources):
    differences.append({'field':'attempt IDs', 'reason':'Missing, extra or duplicate attempt IDs'})
for result in data['results']:
    raw = sources.get(result['id'])
    if raw is None:
        continue
    expected = {field:float(raw[source]) if raw.get(source) not in [None,''] else None for field,source in numeric_fields.items()}
    expected.update({field:raw[source] for field,source in text_fields.items()})
    expected['mode'] = {'S':'Single','D':'Double'}[raw['modo']]
    expected['performance'] = raw.get('etiqueta_resultado') or None
    for field,value in expected.items():
        checks += 1
        if result.get(field) != value:
            differences.append({'attempt':result['id'], 'field':field, 'site':result.get(field), 'source':value})
missing = [
    {'attempt':result['id'], 'player':next(player['name'] for player in data['players'] if player['id']==result['player']),
     'song':result['song'], 'field':field, 'sourceReference':result['sourceReference']}
    for result in data['results'] for field in machine_fields if result.get(field) is None
]
report = {
    'reviewedAt':'2026-11-01', 'attemptCount':len(ids), 'comparedValues':checks,
    'completeJudgmentAttempts':sum(all(result.get(field) is not None for field in judgments) for result in data['results']),
    'allSourceValuesMatch':not differences, 'differences':differences, 'missingMachineValues':missing,
    'sources':[{'file':path.name,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()} for path in [workbook_path,*csv_paths]],
}
(root/'data/validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(f'{checks} source values checked across {len(ids)} attempts; {len(differences)} differences; {len(missing)} missing machine values.')
if differences:
    print(json.dumps(differences,ensure_ascii=False,indent=2))
    sys.exit(1)
