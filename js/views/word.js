/* 单词详情页 */
window.VIEWS = window.VIEWS || {};
VIEWS.word = {
  title: '单词 · 奥格登 850',
  render(params) {
    const e = DataIndex.words.find(x => x.id === params.id);
    if (!e) return '<div class="stub wrap">没有这个词条。<br><br><a class="btn" href="#/words">回到词表</a></div>';
    document.title = `${e.w} ${e.zh.split('；')[0]} · 奥格登 850`;

    const c = DataIndex.cats.find(x => x.id === e.cat);
    const s = Store.strengthOf(e.w);
    const starred = Store.isStarred(e.w);
    const family = Derive.familyOf(e);

    /* 例句中英拆分：ASCII 段为英文，其后为中文 */
    let exHtml = '';
    if (e.ex) {
      const m = e.ex.match(/^([!-~][^一-鿿]*?)\s*([一-鿿].*)$/);
      exHtml = `<div class="word-ex"><div class="en">${m ? m[1] : e.ex}</div><div class="zh">${m ? m[2] : ''}</div></div>`;
    }

    const opp = e.opp && DataIndex.byWord.get(e.opp);
    const reverseOpp = DataIndex.words.find(x => x.opp === e.w);

    const idx = c.words.findIndex(x => x.id === e.id);
    const prev = c.words[idx - 1], next = c.words[idx + 1];

    return `
    <div class="wrap-narrow">
      <p style="margin:26px 0 0"><a href="#/words?cat=${c.id}">← ${c.no} ${c.name}（${c.count} 词）</a></p>

      <div class="word-hero">
        <div>
          <span class="w">${e.w}</span>
          <button class="say-btn" id="say" title="发音" aria-label="发音 ${e.w}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>
          </button>
        </div>
        <p class="phon">${c.en} · ${c.no} ${c.name}${e.grp ? ' · ' + e.grp : ''}</p>
        <p class="zh-meaning">${e.zh}</p>
        ${opp ? `<p style="margin-top:8px">反义词：<a href="#/word/${opp.id}">${opp.w}（${opp.zh}）</a></p>` : ''}
        ${!opp && reverseOpp ? `<p style="margin-top:8px">反义词：<a href="#/word/${reverseOpp.id}">${reverseOpp.w}（${reverseOpp.zh}）</a></p>` : ''}
        ${exHtml}
        <div class="word-meta">
          <span class="tag">学习状态 <b id="state-label">${s === 2 ? '掌握' : s === 1 ? '模糊' : '未学'}</b></span>
        </div>
        <div class="word-actions">
          <button class="btn btn-sm mark-btn" data-s="2" ${s === 2 ? 'disabled' : ''}>掌握</button>
          <button class="btn btn-sm btn-quiet mark-btn" data-s="1" ${s === 1 ? 'disabled' : ''}>模糊</button>
          <button class="btn btn-sm btn-quiet mark-btn" data-s="0" ${s === 0 ? 'disabled' : ''}>未学</button>
          <button class="btn btn-sm btn-quiet" id="star-btn">${starred ? '★ 在生词本' : '☆ 加入生词本'}</button>
        </div>
      </div>

      ${family.length ? `
      <section>
        <h2 style="font-size:19px;border-bottom:2px solid var(--ink);padding-bottom:8px">词族（构词规则展开）</h2>
        <div class="family-grid">
          ${family.map(f => `
          <div class="family-item">
            <span class="frule">${f.rule}</span><br>
            <span class="fw">${f.word}</span>
            <span class="fzh">— ${f.zh}</span>
          </div>`).join('')}
        </div>
      </section>` : ''}

      <div style="display:flex;justify-content:space-between;margin-top:30px">
        ${prev ? `<a class="btn btn-quiet" href="#/word/${prev.id}">← ${prev.w}</a>` : '<span></span>'}
        ${next ? `<a class="btn btn-quiet" href="#/word/${next.id}">${next.w} →</a>` : '<span></span>'}
      </div>
    </div>`;
  },

  mount(root) {
    const e = DataIndex.words.find(x => x.id === location.hash.split('/')[2].split('?')[0]);
    if (!e) return;
    root.querySelector('#say').addEventListener('click', () => Speak.say(e.w));
    root.querySelectorAll('.mark-btn').forEach(b => b.addEventListener('click', () => {
      Store.markLearned(e.w, Number(b.dataset.s));
      Router.render();
    }));
    root.querySelector('#star-btn').addEventListener('click', ev => {
      const on = Store.toggleStar(e.w);
      ev.target.textContent = on ? '★ 在生词本' : '☆ 加入生词本';
    });
  }
};
