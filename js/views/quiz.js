/* 测验 — 选择题（英→中 / 中→英）与拼写 */
window.VIEWS = window.VIEWS || {};
VIEWS.quiz = {
  title: '测验 · 奥格登 850',
  render() {
    return `
    <div class="wrap">
      <header class="page-head">
        <h1>测验</h1>
        <p class="sub">每轮 10 题。答对 8 题以上，可以把这个词顺手标成"掌握"。</p>
      </header>
      <div id="quiz-root"></div>
    </div>`;
  },

  mount(root) {
    const host = root.querySelector('#quiz-root');
    const state = { mode: 'en2zh', cat: 'all', i: 0, score: 0, qs: [], done: false, answered: false, spell: { input: '', ok: null } };

    function pool() {
      return state.cat === 'all' ? DataIndex.alphabetical : DataIndex.cats.find(c => c.id === state.cat).words;
    }
    function pick(qs) {
      const arr = pool().slice();
      for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
      return arr.slice(0, qs);
    }
    function distractors(x, n) {
      const arr = DataIndex.words.filter(w => w.id !== x.id);
      const out = [];
      while (out.length < n && arr.length) {
        const i = Math.floor(Math.random() * arr.length);
        const c = arr.splice(i, 1)[0];
        if (c.zh !== x.zh) out.push(c);
      }
      return out;
    }

    function buildRound() {
      state.i = 0; state.score = 0; state.done = false;
      state.qs = pick(10).map(x => ({
        x,
        opts: [x].concat(distractors(x, 3)).sort(() => Math.random() - 0.5)
      }));
    }

    function catOptions() {
      return [{ id: 'all', name: '全部 850' }].concat(DataIndex.cats.map(c => ({ id: c.id, name: `${c.no} ${c.name} ${c.count}` })))
        .map(o => `<option value="${o.id}"${o.id === state.cat ? ' selected' : ''}>${o.name}</option>`).join('');
    }

    function verdict(sc, t) {
      const r = sc / t;
      if (r === 1) return '全对——850 词在你手里。';
      if (r >= 0.8) return '很好，基本拿下。';
      if (r >= 0.5) return '过半了，把错过的词加进生词本。';
      return '别灰心，先用闪卡过几轮再来。';
    }

    function render() {
      if (!state.done && !state.qs.length) {
        host.innerHTML = `
        <div class="quiz-stage">
          <div class="flash-controls" style="justify-content:flex-start;margin-bottom:18px">
            <select id="qz-cat">${catOptions()}</select>
            <button class="btn${state.mode === 'en2zh' ? ' btn-solid' : ''}" data-mode="en2zh">英→中</button>
            <button class="btn${state.mode === 'zh2en' ? ' btn-solid' : ''}" data-mode="zh2en">中→英</button>
            <button class="btn${state.mode === 'spell' ? ' btn-solid' : ''}" data-mode="spell">拼写</button>
          </div>
          <p class="prose" style="color:var(--ink-soft)">选好范围和方向，开始一轮 10 题。</p>
          <button class="btn btn-stamp" id="qz-start">开始测验</button>
        </div>`;
        host.querySelector('#qz-cat').addEventListener('change', e => { state.cat = e.target.value; render(); });
        host.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => { state.mode = b.dataset.mode; render(); }));
        host.querySelector('#qz-start').addEventListener('click', () => { buildRound(); render(); });
        return;
      }

      if (state.done) {
        const t = state.qs.length;
        host.innerHTML = `
        <div class="quiz-stage quiz-result">
          <div class="score">${state.score} <span style="color:var(--ink-soft);font-size:26px">/ ${t}</span></div>
          <p class="verdict">${verdict(state.score, t)}</p>
          <div class="flash-controls" style="justify-content:center">
            <button class="btn btn-stamp" id="qz-again">再来一轮</button>
            <button class="btn btn-quiet" id="qz-back">换个模式</button>
          </div>
        </div>`;
        host.querySelector('#qz-again').addEventListener('click', () => { buildRound(); render(); });
        host.querySelector('#qz-back').addEventListener('click', () => { state.qs = []; render(); });
        return;
      }

      const q = state.qs[state.i];
      if (state.mode === 'spell') {
        host.innerHTML = `
        <div class="quiz-stage spell-stage">
          <div class="quiz-meta"><span>拼写 · 第 ${state.i + 1} / ${state.qs.length} 题</span><span>得分 ${state.score}</span></div>
          <p class="spell-prompt">${q.x.zh}</p>
          <p class="spell-hint">${q.x.grp || DataIndex.cats.find(c => c.id === q.x.cat).name}${state.spell.ok === false ? ' · 首字母 ' + q.x.w[0].toUpperCase() : ''}</p>
          <input class="spell-input" id="sp-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="type the word…" value="${state.spell.input.replace(/"/g, '&quot;')}">
          <div class="spell-feedback ${state.spell.ok === true ? 'ok' : state.spell.ok === false ? 'no' : ''}" id="sp-fb">
            ${state.spell.ok === true ? '✓ 正确' : state.spell.ok === false ? `✗ 正确答案是 <b>${q.x.w}</b>` : '输入后按回车检查'}
          </div>
          <div class="flash-controls">
            ${state.spell.ok === null
              ? '<button class="btn btn-stamp" id="sp-check">检查</button>'
              : '<button class="btn" id="sp-next">下一题 →</button>'}
            <button class="btn btn-quiet" id="sp-say">🔊 发音</button>
          </div>
        </div>`;
        const inp = host.querySelector('#sp-in');
        inp.focus();
        inp.addEventListener('input', () => { state.spell.input = inp.value; });
        const check = () => {
          state.spell.ok = inp.value.trim().toLowerCase() === q.x.w.toLowerCase();
          if (state.spell.ok) state.score++;
          render();
        };
        inp.addEventListener('keydown', e => {
          if (e.key !== 'Enter') return;
          if (state.spell.ok === null) check();
          else nextQ();
        });
        const chk = host.querySelector('#sp-check');
        if (chk) chk.addEventListener('click', check);
        const nxt = host.querySelector('#sp-next');
        if (nxt) nxt.addEventListener('click', nextQ);
        host.querySelector('#sp-say').addEventListener('click', () => Speak.say(q.x.w));
        return;
      }

      const isEn2Zh = state.mode === 'en2zh';
      host.innerHTML = `
      <div class="quiz-stage">
        <div class="quiz-meta"><span>${isEn2Zh ? '英→中' : '中→英'} · 第 ${state.i + 1} / ${state.qs.length} 题</span><span>得分 ${state.score}</span></div>
        <p class="quiz-q">${isEn2Zh ? q.x.w : `<span class="zhq">${q.x.zh}</span>`}</p>
        <div class="quiz-opts">
          ${q.opts.map((o, k) => `
          <button class="quiz-opt" data-id="${o.id}">
            <span style="color:var(--ink-soft);font-size:12px;margin-right:8px">${k + 1}</span>
            ${isEn2Zh ? `<span class="zh-opt">${o.zh}</span>` : o.w}
          </button>`).join('')}
        </div>
        <p class="flash-hint" style="margin-top:14px">键盘 1–4 可直接选</p>
      </div>`;

      function answer(btn) {
        if (state.answered) return;
        state.answered = true;
        const pickEl = btn.dataset.id === q.x.id;
        if (pickEl) state.score++;
        host.querySelectorAll('.quiz-opt').forEach(b => {
          b.disabled = true;
          if (b.dataset.id === q.x.id) b.classList.add('right');
          else if (b === btn) b.classList.add('wrong');
        });
        setTimeout(() => { state.answered = false; nextQ(); }, 650);
      }
      host.querySelectorAll('.quiz-opt').forEach(b => b.addEventListener('click', () => answer(b)));
    }

    function nextQ() {
      state.spell = { input: '', ok: null };
      state.i++;
      if (state.i >= state.qs.length) {
        state.done = true;
        Store.addQuizRecord({ d: new Date().toISOString().slice(0, 10), mode: state.mode, cat: state.cat, score: state.score, total: state.qs.length });
        render();
      } else render();
    }

    const onKey = e => {
      if (state.done || !state.qs.length || state.mode === 'spell') return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4) {
        const b = host.querySelectorAll('.quiz-opt')[n - 1];
        if (b) b.click();
      }
    };
    document.addEventListener('keydown', onKey);
    render();
    this.destroy = () => document.removeEventListener('keydown', onKey);
  }
};
