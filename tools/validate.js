/* 数据校验：850 词总数、分类数量、去重、反义词回链 */
global.window = global; // 模拟浏览器：window.X 即全局 X
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'js', 'data');
['operations.js', 'things.js', 'picturable.js', 'qualities.js', 'international.js',
  'phonetics.js', 'phonetics2.js', 'examples_a.js', 'examples_b.js', 'examples_c.js'].forEach(f => {
  eval(fs.readFileSync(path.join(dir, f), 'utf8'));
});
eval(fs.readFileSync(path.join(dir, 'index.js'), 'utf8'));

const D = window.DataIndex;
const D0 = window.OGDEN_DATA;
const expect = { operations: 100, things: 400, picturable: 200, qualities: 100, opposites: 50, international: 200 };
let fail = 0;
for (const [k, n] of Object.entries(expect)) {
  const got = D0[k].length;
  const ok = got === n;
  if (!ok) fail++;
  console.log(`${ok ? 'OK ' : 'FAIL'} ${k}: ${got} / ${n}`);
}
const seen = new Map();
let dupes = [];
D.words.forEach(w => {
  const key = w.w.toLowerCase();
  if (seen.has(key)) dupes.push(`${w.w} ↔ ${seen.get(key)}`);
  seen.set(key, w.w);
});
console.log(`${dupes.length ? 'FAIL' : 'OK '} 去重: ${dupes.length ? dupes.join(', ') : '无重复'}`);
if (dupes.length) fail++;
console.log(`OK? 总数: ${D.count} / 850 ${D.count === 850 ? '' : '!!'}`);
if (D.count !== 850) fail++;
const missingOpp = D.words.filter(w => w.opp && !D.byWord.has(w.opp));
console.log(`${missingOpp.length ? 'FAIL' : 'OK '} 反义词引用完整: ${missingOpp.length ? missingOpp.map(w=>w.w).join(',') : '完整'}`);
if (missingOpp.length) fail++;
/* 音标与例句全覆盖 */
const PH = Object.assign({}, D0.phonetics, D0.phonetics2);
const EX = Object.assign({}, D0.examplesA, D0.examplesB, D0.examplesC);
const missPh = D.words.filter(w => !PH[w.w]);
const missEx = D.words.filter(w => !w.ex);
console.log(`${missPh.length ? 'FAIL' : 'OK '} IPA 音标覆盖: ${850 - missPh.length} / 850`);
if (missPh.length) { console.log('  缺: ' + missPh.map(w => w.w).join(',')); fail++; }
console.log(`${missEx.length ? 'FAIL' : 'OK '} 例句覆盖: ${850 - missEx.length} / 850`);
if (missEx.length) { console.log('  缺: ' + missEx.map(w => w.w).join(',')); fail++; }
/* 国际词顺序 */
const iw = D.intl.map(x => x.w);
const sortedIw = iw.slice().sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
const misSorted = iw.filter((w, i) => w.toLowerCase() !== sortedIw[i].toLowerCase());
console.log(`${misSorted.length ? 'FAIL' : 'OK '} 国际词字母序: ${misSorted.length ? misSorted.join(',') : '有序'}`);
if (misSorted.length) fail++;
process.exit(fail ? 1 : 0);
