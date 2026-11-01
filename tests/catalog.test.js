const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const catalog = JSON.parse(fs.readFileSync('data/catalog.json', 'utf8'));
const context = {window:{}};
vm.runInNewContext(fs.readFileSync('data/results.js','utf8'),context);
const data = context.window.TOURNAMENT_DATA;
assert.equal(catalog.songs.length, 12);
assert.equal(new Set(catalog.songs.map(song => song.id)).size, 12);
for (const attempt of data.results) {
  const song = catalog.songs.find(record => record.id === attempt.songId);
  assert.ok(song, `Catalog match for ${attempt.song}`);
  assert.ok(song.charts.some(chart => chart.mode === attempt.mode && chart.level === attempt.level), `Current chart for ${attempt.song}`);
  assert.ok(song.artist && song.bpmMin > 0 && song.mainSeriesDebut);
  for (const asset of [song.thumbnail, song.cover]) {
    const bytes = fs.readFileSync(asset);
    assert.equal(bytes.toString('ascii',0,4),'RIFF', `Valid WebP ${asset}`);
    assert.equal(bytes.toString('ascii',8,12),'WEBP');
  }
}
for (const source of JSON.parse(fs.readFileSync('data/asset-sources.json', 'utf8'))) {
  const hash = require('node:crypto').createHash('sha256').update(fs.readFileSync(source.localPath)).digest('hex');
  assert.equal(hash,source.localSha256, `Asset integrity: ${source.title}`);
}
assert.equal(data.results.filter(attempt => attempt.score != null).length,6);
console.log('Catalog checks passed: 12 covers, metadata and matching current charts.');
