/* 学习进度存储 — localStorage 持久化 */
window.Store = (function () {
  const KEY = 'ogden850.v1';
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        s.learned = s.learned || {};
        s.starred = s.starred || [];
        s.quizLog = s.quizLog || [];
        s.theme = s.theme || null;
        s.cards = s.cards || { pos: 0, dir: 'en2zh', cat: 'all' };
        return s;
      }
    } catch (e) { /* 损坏则重置 */ }
    return { learned: {}, starred: [], quizLog: [], theme: null, cards: { pos: 0, dir: 'en2zh', cat: 'all' } };
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 存储满时静默 */ }
    document.dispatchEvent(new CustomEvent('store:change'));
  }

  /* s: 0 未掌握, 1 模糊, 2 掌握 */
  function markLearned(word, s) {
    if (s === 0) delete state.learned[word];
    else state.learned[word] = { s, t: Date.now() };
    save();
  }
  function strengthOf(word) {
    return state.learned[word] ? state.learned[word].s : 0;
  }
  function toggleStar(word) {
    const i = state.starred.indexOf(word);
    if (i >= 0) state.starred.splice(i, 1);
    else state.starred.push(word);
    save();
    return i < 0;
  }
  function isStarred(word) { return state.starred.includes(word); }

  function addQuizRecord(rec) {
    state.quizLog.unshift(rec);
    if (state.quizLog.length > 100) state.quizLog.length = 100;
    save();
  }
  function quizLog() { return state.quizLog; }

  function stats() {
    const counts = { 1: 0, 2: 0 };
    Object.values(state.learned).forEach(v => { counts[v.s] = (counts[v.s] || 0) + 1; });
    return {
      learned: (counts[1] || 0) + (counts[2] || 0),
      mastered: counts[2] || 0,
      fuzzy: counts[1] || 0,
      starred: state.starred.length,
      quizzes: state.quizLog.length
    };
  }
  function statsByCat(byCat) {
    const out = {};
    byCat.forEach(cat => {
      out[cat.id] = cat.words.reduce((n, w) => n + (state.learned[w.w] ? 1 : 0), 0);
    });
    return out;
  }

  function getTheme() { return state.theme; }
  function setTheme(t) { state.theme = t; save(); }
  function getCards() { return state.cards; }
  function setCards(patch) { Object.assign(state.cards, patch); save(); }

  function resetAll() {
    state = { learned: {}, starred: [], quizLog: [], theme: state.theme, cards: { pos: 0, dir: 'en2zh', cat: 'all' } };
    save();
  }

  return { markLearned, strengthOf, toggleStar, isStarred, addQuizRecord, quizLog, stats, statsByCat, getTheme, setTheme, getCards, setCards, resetAll };
})();
