const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const data = require('../data/results.json');
const catalog = require('../data/catalog.json');
const scoring = require('../scoring.js');
const nodes = new Map();
const handlers = {};
function node(id) {
  if (!nodes.has(id)) nodes.set(id, {
    id, value: id === 'sort' ? 'points' : '', options: [], innerHTML: '', textContent: '', open: false,
    add(option) { this.options.push(option); }, addEventListener() {},
    querySelector() { return { addEventListener() {}, focus() {} }; },
    showModal() { this.open = true; }, close() { this.open = false; },
  });
  return nodes.get(id);
}
const document = {getElementById: node, activeElement: {}, addEventListener(type, handler) { handlers[type] = handler; }};
const context = {window: {TOURNAMENT_DATA:data, PHOENIX_CATALOG:catalog, PIUScore:scoring}, document,
  location:{search:'', href:'https://piu.kazza.jp/'}, history:{replaceState() {}}, URLSearchParams, URL, Intl,
  Option: function(text, value) { this.text=text; this.value=String(value); }};
vm.runInNewContext(fs.readFileSync('app.js','utf8'), context);
function click(kind,id) {
  handlers.click({target:{closest(selector) {
    return selector === `[data-${kind}]` ? {dataset:{[kind]:id}} : null;
  }}});
}
for (const attempt of data.results) {
  click('attempt',attempt.id);
  const html=node('detail-content').innerHTML;
  for (const field of ['perfect','great','good','bad','miss']) {
    const label=field[0].toUpperCase()+field.slice(1);
    assert.ok(html.includes(`<dt>${label}</dt><dd>${attempt[field].toLocaleString('en-US')}</dd>`), `${attempt.id} ${field}`);
  }
  assert.ok(html.includes(attempt.sourceReference.file),`${attempt.id} source`);
  assert.ok(html.includes(`<b>${scoring.factors[attempt.grade].toFixed(2)} (${attempt.grade})</b>`),`${attempt.id} grade multiplier label`);
  assert.ok(html.includes(`<b>${scoring.points(attempt,data.event).toLocaleString('en-US')} tournament points</b>`),`${attempt.id} displayed tournament points`);
}
click('song','pumpout:1007');
const songHtml = node('detail-content').innerHTML;
assert.ok(songHtml.includes('RECORDED RESULTS'));
assert.ok(songHtml.includes('AZUAAAAO'));
assert.ok(songHtml.includes('Perfect <b>652</b>'));
assert.ok(songHtml.includes('Miss <b>123</b>'));
click('attempt','ATT-00057');
assert.ok(node('detail-content').innerHTML.includes('<dt>Machine score</dt><dd>N/A</dd>'));
console.log('Display checks passed for all 83 attempts and recorded song results.');

click('attempt','ATT-00012');
assert.ok(node('detail-content').innerHTML.includes('Base points: Lv. 22 × 100 = 2,200'));
assert.ok(node('detail-content').innerHTML.includes('<b>1.10 (AAA)</b>'));
assert.ok(node('detail-content').innerHTML.includes('<b>2,420 tournament points</b>'));
