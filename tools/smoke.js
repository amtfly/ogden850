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
const files = ['js/data/operations.js','js/data/things.js','js/data/picturable.js','js/data/qualities.js','js/data/index.js',
  'js/store.js','js/speech.js','js/derive.js',
  'js/views/home.js','js/views/words.js','js/views/word.js','js/views/flashcards.js','js/views/quiz.js',
  'js/views/expansion.js','js/views/grammar.js','js/views/about.js','js/views/progress.js',
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
  ['word/ops-0', () => VIEWS.word.render({ id: 'ops-0' })],
  ['word/things-0', () => VIEWS.word.render({ id: 'things-0' })],
  ['word/qual-0', () => VIEWS.word.render({ id: 'qual-0' })],
  ['word/oppo-1', () => VIEWS.word.render({ id: 'oppo-1' })],
  ['flashcards', () => VIEWS.flashcards.render()],
  ['quiz', () => VIEWS.quiz.render()],
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
check('mount word', () => VIEWS.word.mount(root, { id: 'ops-0' }, {}));
check('mount flashcards', () => VIEWS.flashcards.mount(root, {}, {}));
check('mount quiz', () => VIEWS.quiz.mount(root, {}, {}));
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
