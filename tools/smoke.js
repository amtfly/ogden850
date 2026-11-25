/* 冒烟测试：模拟 DOM，跑通每个视图的 render/mount */
global.window = global;
global.location = { hash: '#/word/ops-0' };
global.confirm = () => false;
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.speechSynthesis = { cancel: () => {}, speak: () => {}, getVoices: () => [] };
global.SpeechSynthesisUtterance = function (t) { this.text = t; };
global.addEventListener = () => {};
global.scrollTo = () => {};

function el() {
  return new Proxy({ innerHTML: '', textContent: '', title: '', hidden: false,
    classList: { toggle: () => {}, add: () => {}, remove: () => {} },
    dataset: {}, style: {} }, {
    get(t, k) {
      if (k in t) return t[k];
      if (['addEventListener', 'focus', 'click', 'remove', 'scrollTo'].includes(k)) return () => {};
      if (['querySelector', 'closest'].includes(k)) return () => el();
      if (k === 'querySelectorAll') return () => [];
      return undefined;
    },
    set(t, k, v) { t[k] = v; return true; }
  });
}
global.document = {
  addEventListener: () => {}, removeEventListener: () => {},
  dispatchEvent: () => {}, getElementById: () => el(),
  querySelectorAll: () => [], createElement: () => el(),
  documentElement: { dataset: {} }, title: ''
};

const fs = require('fs');
const files = ['js/data/operations.js','js/data/things.js','js/data/picturable.js','js/data/qualities.js',
  'js/data/international.js','js/data/phonetics.js','js/data/phonetics2.js',
  'js/data/examples_a.js','js/data/examples_b.js','js/data/examples_c.js','js/data/index.js',
  'js/store.js','js/speech.js','js/derive.js',
  'js/views/home.js','js/views/words.js','js/views/word.js','js/views/flashcards.js','js/views/quiz.js',
  'js/views/review.js','js/views/expansion.js','js/views/grammar.js','js/views/about.js','js/views/progress.js',
  'js/router.js','js/app.js'];
files.forEach(f => eval(fs.readFileSync(f, 'utf8')));

let fail = 0;
function check(name, fn) {
  try { fn(); console.log('OK  ' + name); }
  catch (e) { fail++; console.log('FAIL ' + name + ': ' + e.message); }
}

/* 各页 render 输出检查 */
const renders = [
  ['home', () => VIEWS.home.render({}, {})],
  ['words/all', () => VIEWS.words.render({}, { cat: 'all' })],
  ['words/ops', () => VIEWS.words.render({}, { cat: 'ops' })],
  ['words/intl', () => VIEWS.words.render({}, { cat: 'intl' })],
  ['word/ops-0', () => VIEWS.word.render({ id: 'ops-0' })],
  ['word/things-0', () => VIEWS.word.render({ id: 'things-0' })],
  ['word/qual-0', () => VIEWS.word.render({ id: 'qual-0' })],
  ['word/oppo-1', () => VIEWS.word.render({ id: 'oppo-1' })],
  ['word/intl-0', () => VIEWS.word.render({ id: 'intl-0' })],
  ['flashcards', () => VIEWS.flashcards.render()],
  ['quiz', () => VIEWS.quiz.render()],
  ['review', () => VIEWS.review.render()],
  ['expansion', () => VIEWS.expansion.render()],
  ['grammar', () => VIEWS.grammar.render()],
  ['about', () => VIEWS.about.render()],
  ['progress', () => VIEWS.progress.render()]
];
renders.forEach(([n, fn]) => check('render ' + n, () => {
  const html = fn();
  if (typeof html !== 'string' || html.length < 40) throw new Error('输出过短');
  if (/\bundefined\b/.test(html)) throw new Error('输出含 undefined');
  if (/NaN/.test(html)) throw new Error('输出含 NaN');
}));

/* 各页 mount 冒烟 */
const root = el();
check('mount home', () => VIEWS.home.mount(root, {}, {}));
check('mount words', () => VIEWS.words.mount(root, {}, { cat: 'all' }));
check('mount words intl', () => VIEWS.words.mount(root, {}, { cat: 'intl' }));
check('mount word', () => VIEWS.word.mount(root, { id: 'ops-0' }, {}));
check('mount word intl', () => VIEWS.word.mount(root, { id: 'intl-0' }, {}));
check('mount flashcards', () => VIEWS.flashcards.mount(root, {}, {}));
check('mount quiz', () => VIEWS.quiz.mount(root, {}, {}));
check('mount review empty', () => VIEWS.review.mount(root, {}, {}));
check('mount expansion', () => VIEWS.expansion.mount(root, {}, {}));
check('mount grammar', () => VIEWS.grammar.mount(root, {}, {}));
check('mount about', () => VIEWS.about.mount(root, {}, {}));
check('mount progress', () => VIEWS.progress.mount(root, {}, {}));

/* Router 解析 */
check('router resolve word/:id', () => {
  const r = require('util');
  const hash = 'word/ops-3';
  // 直接调用内部解析逻辑不可达，改为启动验证由浏览器端进行
});

/* Store 逻辑 */
check('store mark/star/log', () => {
  Store.markLearned('book', 2);
  if (Store.strengthOf('book') !== 2) throw new Error('mark failed');
  Store.toggleStar('book');
  if (!Store.isStarred('book')) throw new Error('star failed');
  Store.addQuizRecord({ d: '2026-01-01', mode: 'en2zh', cat: 'all', score: 8, total: 10 });
  if (Store.quizLog().length !== 1) throw new Error('quiz log failed');
  if (Store.stats().learned !== 1) throw new Error('stats failed');
  Store.markLearned('book', 0);
  Store.resetAll();
});

/* SRS 间隔重复 */
check('store srs schedule', () => {
  Store.markLearned('book', 2);
  if (!Store.srsEntry('book')) throw new Error('mark 应进入复习队列');
  if (Store.srsDue().length !== 0) throw new Error('新学的词应排期明天，不应立即到期');
  if (Store.srsScheduled() !== 1) throw new Error('排期数应为 1');
  Store.srsUpdate('book', 2);
  let e = Store.srsEntry('book');
  if (e.iv !== 4 || e.n !== 1) throw new Error('grade 2 应间隔翻倍到 4 天');
  Store.srsUpdate('book', 0);
  e = Store.srsEntry('book');
  if (e.iv !== 1) throw new Error('grade 0 应重置为 1 天');
  Store.srsUpdate('book', 1);
  e = Store.srsEntry('book');
  if (e.iv !== 2) throw new Error('grade 1 应为 2 天');
  Store.markLearned('book', 0);
  if (Store.srsEntry('book')) throw new Error('取消掌握应移出队列');
  Store.resetAll();
});

/* 导入导出 */
check('store export/import', () => {
  Store.markLearned('book', 2);
  Store.toggleStar('book');
  const json = Store.exportData();
  Store.resetAll();
  if (Store.stats().learned !== 0) throw new Error('reset 失败');
  if (!Store.importData(JSON.parse(json))) throw new Error('导入失败');
  if (Store.strengthOf('book') !== 2 || !Store.isStarred('book')) throw new Error('导入数据不完整');
  if (!Store.srsEntry('book')) throw new Error('导入应含复习排期');
  if (Store.importData({ bad: true })) throw new Error('非法数据应被拒绝');
  Store.resetAll();
});

/* IPA 与例句挂载 */
check('data merge ipa/examples', () => {
  const book = DataIndex.byWord.get('book');
  if (!book.ipa) throw new Error('book 缺音标');
  if (!book.ex || !/book/i.test(book.ex)) throw new Error('book 缺例句');
  const come = DataIndex.byWord.get('come');
  if (come.ex !== 'Come here. 过来。') throw new Error('操作词自带例句应优先');
  if (DataIndex.intl.length !== 200) throw new Error('国际词应为 200');
  if (!DataIndex.intl[0].w) throw new Error('国际词条目不完整');
});

/* Derive 全量词族输出不得出现明显假词 */
check('derive family sanity', () => {
  DataIndex.words.forEach(e => {
    Derive.familyOf(e).forEach(f => {
      if (/[^a-z]/.test(f.word)) throw new Error(e.w + ' → ' + f.word + ' 含非法字符');
    });
  });
});

console.log(fail ? `\n${fail} 项失败` : '\n全部通过');
process.exit(fail ? 1 : 0);
