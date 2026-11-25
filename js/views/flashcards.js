/* 闪卡 — 翻卡自测，进度记忆 */
window.VIEWS = window.VIEWS || {};
VIEWS.flashcards = {
  title: '闪卡 · 奥格登 850',
  render() {
    return `
    <div class="wrap">
      <header class="page-head">
        <h1>闪卡记忆</h1>
        <p class="sub">空格翻面 · ←/→ 前后张 · 按 1 标"模糊"、按 2 标"掌握"。进度会记住，下次接着翻。</p>
      </header>
      <div id="flash-root"></div>
    </div>`;
  },

  mount(root) {
    const host = root.querySelector('#flash-root');
    const cfg = Store.getCards();
    const state = { cat: cfg.cat || 'all', dir: cfg.dir || 'en2zh', pos: cfg.pos || 0, flipped: false, order: null };

    function deck() {
      const base = state.cat === 'all' ? DataIndex.alphabetical : DataIndex.cats.find(c => c.id === state.cat).words;
      return state.order || base;
    }
    function saveCfg() { Store.setCards({ pos: state.pos, dir: state.dir, cat: state.cat }); }

    function catOptions() {
      return [{ id: 'all', name: '全部 850' }].concat(DataIndex.cats.map(c => ({ id: c.id, name: `${c.no} ${c.name} ${c.count}` })))
        .map(o => `<option value="${o.id}"${o.id === state.cat ? ' selected' : ''}>${o.name}</option>`).join('');
    }

    function render() {
      const d = deck();
      if (state.pos >= d.length) state.pos = 0;
      const x = d[state.pos];
      const front = state.dir === 'en2zh' ? `<div class="fw">${x.w}</div>` : `<div class="fzh">${x.zh}</div>`;
      const back = state.dir === 'en2zh'
        ? `<div class="fzh">${x.zh}</div>${x.ipa ? `<div class="ipa">${x.ipa}</div>` : ''}<div class="fgrp">${x.grp || DataIndex.cats.find(c => c.id === x.cat).name}</div>`
        : `<div class="fw">${x.w}</div>${x.ipa ? `<div class="ipa">${x.ipa}</div>` : ''}<div class="fgrp">${x.grp || DataIndex.cats.find(c => c.id === x.cat).name}</div>`;
      const s = Store.strengthOf(x.w);

      host.innerHTML = `
      <div class="flash-stage">
        <div class="flash-controls" style="justify-content:flex-start;margin-bottom:14px">
          <select id="fc-cat">${catOptions()}</select>
          <button class="btn btn-sm btn-quiet" id="fc-dir">方向：${state.dir === 'en2zh' ? '英→中' : '中→英'}</button>
          <button class="btn btn-sm btn-quiet" id="fc-shuffle">乱序</button>
        </div>
        <div class="flash-meta">
          <span>${state.pos + 1} / ${d.length}${state.cat !== 'all' ? ' · ' + DataIndex.cats.find(c => c.id === state.cat).name : ''}</span>
          <span>状态：${s === 2 ? '● 掌握' : s === 1 ? '◐ 模糊' : '未学'}</span>
        </div>
        <div class="flash-card${state.flipped ? ' flipped' : ''}" id="fc-card" role="button" tabindex="0" aria-label="单词卡，点击翻面">
          <div class="face front">${front}<div class="flash-hint">点击或按空格翻面</div></div>
          <div class="face back">${back}
            <button class="say-btn" id="fc-say" title="发音">🔊</button>
          </div>
        </div>
        <div class="flash-controls">
          <button class="btn btn-quiet" id="fc-prev">← 上一张</button>
          <button class="btn mark-1" id="fc-fuzzy">模糊（1）</button>
          <button class="btn btn-stamp mark-2" id="fc-know">掌握（2）</button>
          <button class="btn" id="fc-next">下一张 →</button>
        </div>
        <p class="flash-hint" style="margin-top:16px">标记后自动跳到下一张；<span class="kbd">空格</span> 翻面 · <span class="kbd">←</span><span class="kbd">→</span> 移动</p>
      </div>`;

      const card = host.querySelector('#fc-card');
      const flip = () => { state.flipped = !state.flipped; card.classList.toggle('flipped', state.flipped); };
      card.addEventListener('click', flip);
      host.querySelector('#fc-say').addEventListener('click', e => { e.stopPropagation(); Speak.say(x.w); });

      const move = n => { state.pos = (state.pos + n + d.length) % d.length; state.flipped = false; saveCfg(); render(); };
      host.querySelector('#fc-prev').addEventListener('click', () => move(-1));
      host.querySelector('#fc-next').addEventListener('click', () => move(1));
      host.querySelector('#fc-fuzzy').addEventListener('click', () => { Store.markLearned(x.w, 1); move(1); });
      host.querySelector('#fc-know').addEventListener('click', () => { Store.markLearned(x.w, 2); move(1); });

      host.querySelector('#fc-cat').addEventListener('change', e => {
        state.cat = e.target.value; state.pos = 0; state.order = null; state.flipped = false; saveCfg(); render();
      });
      host.querySelector('#fc-dir').addEventListener('click', () => {
        state.dir = state.dir === 'en2zh' ? 'zh2en' : 'en2zh'; saveCfg(); render();
      });
      host.querySelector('#fc-shuffle').addEventListener('click', () => {
        const arr = (state.cat === 'all' ? DataIndex.alphabetical : DataIndex.cats.find(c => c.id === state.cat).words).slice();
        for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
        state.order = arr; state.pos = 0; state.flipped = false; render();
      });
    }

    const onKey = e => {
      if (e.target.tagName === 'SELECT') return;
      if (e.key === ' ') { e.preventDefault(); const c = host.querySelector('#fc-card'); if (c) c.click(); }
      else if (e.key === 'ArrowRight') host.querySelector('#fc-next').click();
      else if (e.key === 'ArrowLeft') host.querySelector('#fc-prev').click();
      else if (e.key === '1') host.querySelector('#fc-fuzzy').click();
      else if (e.key === '2') host.querySelector('#fc-know').click();
    };
    document.addEventListener('keydown', onKey);
    render();
    this.destroy = () => document.removeEventListener('keydown', onKey);
  }
};
