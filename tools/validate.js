/* 数据校验：850 词总数、分类数量、去重、反义词回链 */
global.window = global; // 模拟浏览器：window.X 即全局 X
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'js', 'data');
['operations.js', 'things.js', 'picturable.js', 'qualities.js'].forEach(f => {
  eval(fs.readFileSync(path.join(dir, f), 'utf8'));
});
eval(fs.readFileSync(path.join(dir, 'index.js'), 'utf8'));

const D = window.DataIndex;
const D0 = window.OGDEN_DATA;
const expect = { operations: 100, things: 400, picturable: 200, qualities: 100, opposites: 50 };
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
process.exit(fail ? 1 : 0);
