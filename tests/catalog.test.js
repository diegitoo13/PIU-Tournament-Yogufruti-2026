const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const catalog = JSON.parse(fs.readFileSync('data/catalog.json', 'utf8'));
const context = {window:{}};
vm.runInNewContext(fs.readFileSync('data/results.js','utf8'),context);
const data = context.window.TOURNAMENT_DATA;
assert.equal(catalog.songs.length, 61);
assert.equal(new Set(catalog.songs.map(song => song.id)).size, 61);
for (const attempt of data.results) {
  if (!attempt.songIdentityVerified) {
    assert.equal(attempt.sourceSongId,null);
    assert.equal(attempt.song,'Song N/A');
    assert.ok(attempt.songId.startsWith('workbook:'));
    continue;
  }
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
assert.equal(data.results.filter(attempt => attempt.score != null).length,70);
console.log('Catalog checks passed: 61 covers, metadata and matching current charts.');

for (const source of JSON.parse(fs.readFileSync('data/profile-assets.json', 'utf8'))) {
  const hash = require('node:crypto').createHash('sha256').update(fs.readFileSync(source.localPath)).digest('hex');
  assert.equal(hash,source.localSha256,`Profile asset integrity: ${source.player}`);
}
assert.equal(data.players.filter(player => player.photo).length,3);
const catalogContext = {window:{}};
vm.runInNewContext(fs.readFileSync('data/catalog.js','utf8'),catalogContext);
assert.deepEqual(JSON.parse(JSON.stringify(catalogContext.window.PHOENIX_CATALOG)),catalog,'Browser and portable catalog match');
