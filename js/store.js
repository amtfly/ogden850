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
        s.srs = s.srs || {};
        s.theme = s.theme || null;
        s.cards = s.cards || { pos: 0, dir: 'en2zh', cat: 'all' };
        return s;
      }
    } catch (e) { /* 损坏则重置 */ }
    return { learned: {}, starred: [], quizLog: [], srs: {}, theme: null, cards: { pos: 0, dir: 'en2zh', cat: 'all' } };
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 存储满时静默 */ }
    document.dispatchEvent(new CustomEvent('store:change'));
  }

  const DAY = 86400000;

  /* s: 0 未掌握, 1 模糊, 2 掌握。标记后自动进入复习队列（间隔重复） */
  function markLearned(word, s) {
    if (s === 0) {
      delete state.learned[word];
      delete state.srs[word];
    } else {
      state.learned[word] = { s, t: Date.now() };
      if (!state.srs[word]) state.srs[word] = { iv: 1, due: Date.now() + DAY, n: 0 };
    }
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

  /* 间隔重复（Leitner 简化版）：grade 0 忘记 → 1 天；1 模糊 → 2 天；2 记得 → 间隔翻倍（上限 60 天） */
  function srsUpdate(word, grade) {
    const e = state.srs[word] || { iv: 1, due: Date.now(), n: 0 };
    if (grade === 0) e.iv = 1;
    else if (grade === 1) e.iv = Math.min(Math.max(2, Math.round(e.iv / 2)), 30);
    else e.iv = Math.min(Math.max(e.iv * 2, 4), 60);
    e.due = Date.now() + e.iv * DAY;
    e.n++;
    state.srs[word] = e;
    save();
  }
  function srsEntry(word) { return state.srs[word] || null; }
  function srsAll() { return state.srs; }
  function srsDue(now) {
    now = now || Date.now();
    return Object.entries(state.srs)
      .filter(([, e]) => e.due <= now)
      .sort((a, b) => a[1].due - b[1].due)
      .map(([w]) => w);
  }
  function srsScheduled() { return Object.keys(state.srs).length; }

  /* 导出 / 导入 */
  function exportData() { return JSON.stringify(state, null, 2); }
  function importData(obj) {
    if (!obj || typeof obj !== 'object' || typeof obj.learned !== 'object') return false;
    state = {
      learned: obj.learned,
      starred: Array.isArray(obj.starred) ? obj.starred : [],
      quizLog: Array.isArray(obj.quizLog) ? obj.quizLog : [],
      srs: (obj.srs && typeof obj.srs === 'object') ? obj.srs : {},
      theme: state.theme,
      cards: obj.cards && typeof obj.cards === 'object' ? obj.cards : { pos: 0, dir: 'en2zh', cat: 'all' }
    };
    save();
    return true;
  }

  function getTheme() { return state.theme; }
  function setTheme(t) { state.theme = t; save(); }
  function getCards() { return state.cards; }
  function setCards(patch) { Object.assign(state.cards, patch); save(); }

  function resetAll() {
    state = { learned: {}, starred: [], quizLog: [], srs: {}, theme: state.theme, cards: { pos: 0, dir: 'en2zh', cat: 'all' } };
    save();
  }

  return { markLearned, strengthOf, toggleStar, isStarred, addQuizRecord, quizLog,
    srsUpdate, srsEntry, srsAll, srsDue, srsScheduled,
    exportData, importData,
    stats, statsByCat, getTheme, setTheme, getCards, setCards, resetAll };
})();
