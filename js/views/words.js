/* 词表页 — 分类浏览 / 搜索 / 字母索引 */
window.VIEWS = window.VIEWS || {};
VIEWS.words = {
  title: '词表 · 奥格登 850',
  render(p, q) {
    const cat = (q && q.cat) || 'all';
    const qq = (q && q.q) || '';
    const tabs = [{ id: 'all', name: '全部', n: 850 }]
      .concat(DataIndex.cats.map(c => ({ id: c.id, name: c.name, n: c.count })))
      .map(t => `<a class="cat-tab${t.id === cat ? ' active' : ''}" href="#/words?cat=${t.id}">${t.name}<span class="n">${t.n}</span></a>`)
      .join('');

    const letters = [...new Set(DataIndex.alphabetical.map(x => x.w[0].toUpperCase()))];

    return `
    <div class="wrap">
      <header class="page-head">
        <h1>850 词表</h1>
        <p class="sub">按奥格登的五张词单组织；点任意单词看详情、词族与发音。</p>
      </header>
      <div class="cat-tabs">${tabs}</div>
      <div class="searchbar">
        <input type="search" id="word-search" placeholder="搜索单词或中文释义…" value="${qq.replace(/"/g, '&quot;')}" autocomplete="off">
      </div>
      <div id="letter-bar" class="words-indexbar" hidden>
        <button data-letter="">全部</button>
        ${letters.map(l => `<button data-letter="${l}">${l}</button>`).join('')}
      </div>
      <p class="words-count-note" id="words-note"></p>
      <div id="word-list"></div>
    </div>`;
  },

  mount(root, p, q) {
    const cat = (q && q.cat) || 'all';
    const state = { q: (q && q.q) || '', letter: '' };
    const listEl = root.querySelector('#word-list');
    const noteEl = root.querySelector('#words-note');
    const searchEl = root.querySelector('#word-search');
    const letterBar = root.querySelector('#letter-bar');

    function rowHtml(x) {
      const s = Store.strengthOf(x.w);
      const starred = Store.isStarred(x.w);
      return `
      <a class="ledger-row${s ? ' learned' : ''}${starred ? ' starred' : ''}" href="#/word/${x.id}">
        <span class="mark">${s === 2 ? '●' : s === 1 ? '◐' : ''}</span>
        <span class="w">${x.w}</span>
        <span class="zh">${x.zh}</span>
        <span class="grp">${x.grp || DataIndex.cats.find(c => c.id === x.cat).name}</span>
        <button class="star-btn btn-quiet btn btn-sm" data-word="${x.w}" title="加入/移出生词本">${starred ? '★' : '☆'}</button>
      </a>`;
    }

    function renderList() {
      let items, html = '';
      if (state.q) {
        items = DataIndex.search(state.q);
        noteEl.textContent = `搜索"${state.q}"：${items.length} 个结果（全部 850 词内）`;
        html = `<div class="ledger">${items.map(rowHtml).join('')}</div>`;
      } else if (cat === 'all') {
        items = DataIndex.alphabetical.filter(x => !state.letter || x.w[0].toUpperCase() === state.letter);
        let last = '';
        items.forEach(x => {
          const L = x.w[0].toUpperCase();
          if (L !== last) { html += `<h3 class="letter-h">${L}</h3>`; last = L; }
          html += rowHtml(x);
        });
        if (!items.length) html = '<p class="empty-note">这个字母下没有词。</p>';
        else html = `<div class="ledger">${html}</div>`;
        noteEl.textContent = `${items.length} 词${state.letter ? ' · 首字母 ' + state.letter : ''} · ● 掌握 ◐ 模糊 ☆ 生词本`;
      } else {
        const c = DataIndex.cats.find(x => x.id === cat);
        items = c.words;
        let last = '';
        items.forEach(x => {
          const g = x.grp || '';
          if (g && g !== last) { html += `<h3 class="letter-h">${g}</h3>`; last = g; }
          html += rowHtml(x);
        });
        html = `<div class="ledger">${html}</div>`;
        const learned = items.reduce((n, x) => n + (Store.strengthOf(x.w) ? 1 : 0), 0);
        noteEl.textContent = `${c.no} ${c.name}（${c.en}）· ${items.length} 词 · 已学 ${learned}`;
      }
      listEl.innerHTML = html;
    }

    /* 搜索防抖 */
    let timer = null;
    searchEl.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => { state.q = searchEl.value.trim(); renderList(); }, 120);
    });

    letterBar.hidden = cat !== 'all' || !!state.q;
    letterBar.addEventListener('click', e => {
      const b = e.target.closest('button[data-letter]');
      if (!b) return;
      state.letter = b.dataset.letter;
      letterBar.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
      renderList();
    });
    if (state.letter) {
      const b = letterBar.querySelector(`[data-letter="${state.letter}"]`);
      if (b) b.classList.add('active');
    }

    listEl.addEventListener('click', e => {
      const btn = e.target.closest('.star-btn');
      if (!btn) return;
      e.preventDefault();
      const on = Store.toggleStar(btn.dataset.word);
      btn.textContent = on ? '★' : '☆';
      btn.closest('.ledger-row').classList.toggle('starred', on);
    });

    renderList();
    this.destroy = () => clearTimeout(timer);
  }
};
