/* 复习 — 间隔重复队列（Leitner 简化版）：到期卡片翻看后按记忆情况排期 */
window.VIEWS = window.VIEWS || {};
VIEWS.review = {
  title: '复习 · 奥格登 850',
  render() {
    return `
    <div class="wrap">
      <header class="page-head">
        <h1>复习</h1>
        <p class="sub">标记学过的词会自动进入复习队列：忘记的明天再来，记得的间隔翻倍，直到排期满两个月。</p>
      </header>
      <div id="review-root"></div>
    </div>`;
  },

  mount(root) {
    const host = root.querySelector('#review-root');
    const state = { queue: [], i: 0, flipped: false, done: 0 };

    function fmtDate(ts) {
      const d = new Date(ts);
      return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
    }

    function render() {
      if (!state.queue.length) state.queue = Store.srsDue();
      const due = state.queue;
      const scheduled = Store.srsScheduled();

      if (state.i >= due.length) {
        const upcoming = Object.entries(Store.srsAll())
          .map(([, e]) => e.due).sort((a, b) => a - b)[0];
        host.innerHTML = `
        <div class="quiz-stage quiz-result">
          <div class="score">${state.done || 0}</div>
          <p class="verdict">${state.done ? '本轮复习完成，排期已更新。' : '今天没有到期的卡片。'}</p>
          <p class="words-count-note">已排期 ${scheduled} 词${upcoming ? ' · 最近一张到期于 ' + fmtDate(upcoming) : ''}</p>
          <div class="flash-controls" style="justify-content:center;margin-top:18px">
            <a class="btn" href="#/flashcards">去翻卡学新词</a>
            <a class="btn btn-quiet" href="#/progress">看进度</a>
          </div>
        </div>`;
        return;
      }

      const e = DataIndex.byWord.get(due[state.i]);
      if (!e) { state.queue.splice(state.i, 1); render(); return; }
      const srs = Store.srsEntry(e.w) || { iv: 1, n: 0 };
      const ex = Util.splitEx(e.ex);
      const exHtml = ex ? `<div class="fex"><span class="en">${ex.en}</span><span class="zh">${ex.zh}</span></div>` : '';

      host.innerHTML = `
      <div class="flash-stage">
        <div class="flash-meta">
          <span>第 ${state.i + 1} / ${due.length} 张 · 本轮已复习 ${state.done}</span>
          <span>当前间隔 ${srs.iv} 天 · 已复习 ${srs.n} 次</span>
        </div>
        <div class="flash-card${state.flipped ? ' flipped' : ''}" id="rv-card" role="button" tabindex="0" aria-label="复习卡，点击翻面">
          <div class="face front"><div class="fw">${e.w}</div><div class="flash-hint">想起意思了吗？点击或按空格翻面</div></div>
          <div class="face back"><div class="fzh">${e.zh}</div>${e.ipa ? `<div class="ipa">${e.ipa}</div>` : ''}${exHtml}
            <button class="say-btn" id="rv-say" title="发音">🔊</button>
          </div>
        </div>
        <div class="flash-controls">
          <button class="btn-quiet btn mark-1" id="rv-0" title="明天再来">忘记（1）</button>
          <button class="btn mark-1" id="rv-1" title="间隔减半，最短 2 天">模糊（2）</button>
          <button class="btn btn-stamp mark-2" id="rv-2" title="间隔翻倍，上限 60 天">记得（3）</button>
        </div>
        <p class="flash-hint" style="margin-top:16px"><span class="kbd">空格</span> 翻面 · <span class="kbd">1</span><span class="kbd">2</span><span class="kbd">3</span> 评价</p>
      </div>`;

      const card = host.querySelector('#rv-card');
      card.addEventListener('click', () => { state.flipped = !state.flipped; card.classList.toggle('flipped', state.flipped); });
      host.querySelector('#rv-say').addEventListener('click', ev => { ev.stopPropagation(); Speak.say(e.w); });

      const rate = g => {
        Store.srsUpdate(e.w, g);
        state.done++; state.i++; state.flipped = false;
        render();
      };
      host.querySelector('#rv-0').addEventListener('click', () => rate(0));
      host.querySelector('#rv-1').addEventListener('click', () => rate(1));
      host.querySelector('#rv-2').addEventListener('click', () => rate(2));
    }

    const onKey = e => {
      if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
      if (e.key === ' ') {
        e.preventDefault();
        const c = host.querySelector('#rv-card');
        if (c) c.click();
      } else if (e.key === '1') host.querySelector('#rv-0').click();
      else if (e.key === '2') host.querySelector('#rv-1').click();
      else if (e.key === '3') host.querySelector('#rv-2').click();
    };
    document.addEventListener('keydown', onKey);
    render();
    this.destroy = () => document.removeEventListener('keydown', onKey);
  }
};
