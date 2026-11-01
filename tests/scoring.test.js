const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const scoring = require('../scoring.js');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync('data/results.js','utf8'),context);
const data=context.window.TOURNAMENT_DATA;
const standings=scoring.standings(data.players,data.results,data.event);
assert.equal(scoring.counted(data.results,data.event).length,71);
assert.equal(standings[0].total,31580);
assert.equal(scoring.points({valid:true,level:23,grade:'AA'},data.event),2300);
assert.equal(scoring.points({valid:true,level:23,grade:'AA'},{maxLevel:22}),null);
assert.equal(scoring.points({valid:false,level:23,grade:'SSS'},data.event),null);
assert.equal(scoring.points({valid:true,level:4,grade:'SSS'},data.event),null);
assert.equal(scoring.points({valid:true,level:20,grade:'UNKNOWN'},data.event),null);
const attempts=[{id:'02',player:'p',songId:'song',valid:true,level:20,grade:'SS'}, {id:'01',player:'p',songId:'song',valid:true,level:20,grade:'SS'}, {id:'03',player:'p',songId:'song',valid:true,level:20,grade:'S'}];
assert.equal(scoring.counted(attempts)[0].result.id,'01');
const tied=scoring.standings([{id:'p',name:'P'},{id:'q',name:'Q'}],[...attempts,{...attempts[0],id:'04',player:'q'}]);
assert.deepEqual(tied.map(x=>x.rank),[1,1]);
console.log('Scoring checks passed.');
const eligible = {id:'valid',player:'p',songId:'s',valid:true,level:23,grade:'AA',mode:'Single',cut:'Arcade'};
assert.equal(scoring.points({...eligible,cut:'Short Cut'}),null);
assert.equal(scoring.points({...eligible,mode:'Co-Op'}),null);
assert.equal(scoring.points({...eligible,selectionSecond:1799}),2300);
assert.equal(scoring.points({...eligible,selectionSecond:1800}),null);
assert.equal(scoring.points({...eligible,selectionSecond:0}),2300);
assert.equal(scoring.points({...eligible,selectionSecond:-1}),null);
assert.equal(scoring.points({...eligible,selectionSecond:1799,finishedSecond:1900}),2300);
assert.equal(scoring.points({...eligible,deliberateAbandonment:true}),null);
assert.equal(scoring.points({...eligible,passStatus:'Stage break'}),2300);
assert.equal(scoring.points({...eligible,verified:false}),null);
assert.equal(scoring.counted([{...eligible,songId:null}]).length,0);
console.log('Eligibility checks passed.');

const fixture = {'PLY-0001':[31580,12], 'PLY-0002':[29705,12], 'PLY-0003':[23930,12], 'PLY-0004':[14010,12], 'PLY-0005':[25365,11], 'PLY-0006':[21855,12]};
assert.equal(data.players.length,6);
assert.equal(new Set(data.results.map(attempt => attempt.id)).size,71);
for (const row of standings) {
  assert.deepEqual([row.total,row.plays.length],fixture[row.player.id],row.player.name);
}
for (const attempt of data.results) assert.equal(scoring.points(attempt,data.event),attempt.sourcePoints,attempt.id);
const manifest = JSON.parse(fs.readFileSync('data/import-manifest.json','utf8'));
for (const [id,total] of Object.entries(manifest.expectedWorkbookTotals)) {
  assert.equal(standings.find(row => row.player.id === id).total,total,id);
}
const eternal = data.results.find(attempt => attempt.id === 'ATT-00006');
assert.equal(scoring.points(eternal,data.event),3000);
const duplicateChart = {...eternal,id:'repeat',level:23,grade:'AA'};
assert.equal(scoring.standings(data.players,[...data.results,duplicateChart],data.event)[0].total,31580);
const lastSoya = data.results.filter(attempt => attempt.player === 'PLY-0005' && attempt.score === 995092);
assert.equal(lastSoya.length,1,'Final SOYASAUCE photo must not be duplicated');
assert.equal(lastSoya[0].songId,'pumpout:1102');
assert.equal(data.results.find(attempt => attempt.sourceSongKey === 'SONG-0032').songId,'pumpout:1062','83 corrected to B3');
for (const id of ['ATT-00068','ATT-00069']) {
  const attempt = data.results.find(attempt => attempt.id === id);
  assert.equal(attempt.player,'PLY-0006');
  assert.ok(attempt.reviewNote.includes('SPRADA'));
}
assert.equal(data.results.filter(attempt => !attempt.songIdentityVerified).length,3);
assert.deepEqual(JSON.parse(JSON.stringify(data)),JSON.parse(fs.readFileSync('data/results.json','utf8')),'Browser and portable results match');
console.log('Import checks passed: six players, 71 attempts, all source points and totals reconciled.');
