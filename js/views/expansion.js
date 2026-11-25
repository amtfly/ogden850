/* 词族扩展 — 850 词根如何长出上万词 */
window.VIEWS = window.VIEWS || {};
VIEWS.expansion = {
  title: '词族扩展 · 奥格登 850',
  render() {
    const g = Derive.globalCount();
    return `
    <div class="wrap">
      <header class="page-head">
        <h1>词族扩展：从 850 到上万个词</h1>
        <p class="sub">词表只收"词根"。加上复数、-er、-ing、-ed、-ly、un- 和合成规则，每个词根都会长出一家子词。</p>
      </header>

      <div class="math-strip">
        <div class="m"><b>${g.pl}</b><span>名词复数</span></div>
        <div class="m"><b>${g.ing}</b><span>动名词 -ing</span></div>
        <div class="m"><b>${g.part}</b><span>过去分词</span></div>
        <div class="m"><b>${g.ag}</b><span>施动者 -er</span></div>
        <div class="m"><b>${g.ly}</b><span>副词 -ly</span></div>
        <div class="m"><b>${g.un}</b><span>否定 un-</span></div>
        <div class="m"><b>${g.compounds}</b><span>合成词</span></div>
        <div class="m m-total"><b>${g.total}</b><span>850 词根之外的新词形式</span></div>
      </div>

      <div class="prose">
        <p>奥格登的原话是：850 词加规则，做的是约两万英语词的工作。上面的数字是本站按语法规则对 850 个词根的保守估算——只算通用拼写形式，还不算词义引申与习语。你可以在下面挑一个词根，看它的词族。</p>
      </div>

      <div class="searchbar" style="margin-top:20px">
        <input type="text" id="fam-input" list="fam-words" placeholder="输入一个 850 词根，如 book、make、happy…" autocomplete="off">
        <datalist id="fam-words">${DataIndex.alphabetical.map(x => `<option value="${x.w}">`).join('')}</datalist>
        <button class="btn btn-solid btn-sm" id="fam-go">看词族</button>
      </div>
      <div id="fam-out"></div>

      <h2 style="font-size:19px;border-bottom:2px solid var(--ink);padding-bottom:8px;margin-top:34px">合成词示例</h2>
      <table class="rule-table">
        <tr><th>合成词</th><th>来源</th><th>中文</th></tr>
        ${Derive.compounds().map(([a, b, w, zh]) => `<tr><td>${w}</td><td class="eg">${a} + ${b}</td><td>${zh}</td></tr>`).join('')}
      </table>
    </div>`;
  },

  mount(root) {
    const input = root.querySelector('#fam-input');
    const out = root.querySelector('#fam-out');

    function show(w) {
      const e = DataIndex.byWord.get(w.trim().toLowerCase());
      if (!e) {
        out.innerHTML = '<p class="empty-note">850 词表里没有这个词——试试 book、make、happy。</p>';
        return;
      }
      const fam = Derive.familyOf(e);
      out.innerHTML = `
      <div class="family-tree">
        <span style="font-size:12px;color:var(--stamp)">词根 ROOT</span>
        <div class="family-root">${e.w}</div>
        <span style="color:var(--ink-soft);font-size:14px">${e.zh}</span>
        <div class="family-grid">
          ${fam.length ? fam.map(f => `
          <div class="family-item">
            <span class="frule">${f.rule}</span><br>
            <span class="fw">${f.word}</span>
            <span class="fzh">— ${f.zh}</span>
          </div>`).join('') : '<p class="empty-note" style="padding:0">这个词根在本站的规则集里没有展开形式（操作词与限定词按原形使用）。</p>'}
        </div>
        <p style="margin:14px 0 0"><a href="#/word/${e.id}">查看词条详情 →</a></p>
      </div>`;
    }

    const go = () => show(input.value);
    root.querySelector('#fam-go').addEventListener('click', go);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    show('book');
  }
};
