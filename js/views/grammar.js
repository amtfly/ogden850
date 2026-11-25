/* 语法规则页 — 850 词之上的 11 条构词与语法要点 */
window.VIEWS = window.VIEWS || {};
VIEWS.grammar = {
  title: '语法规则 · 奥格登 850',
  render() {
    const rules = [
      { zh: '复数名词加 <b>-s</b> 及相关形式。', en: 'Plural nouns take -s or related forms.', eg: 'drinks, boxes, countries' },
      { zh: '名词可用词尾 <b>-er</b> 或 <b>-ing</b> 构成。', en: 'Nouns are formed with -er or -ing.', eg: 'prisoner, building' },
      { zh: '形容词可用词尾 <b>-ing</b> 或 <b>-ed</b> 构成。', en: 'Adjectives are formed with -ing or -ed.', eg: 'boiling, mixed' },
      { zh: '给"性质词"（形容词）加 <b>-ly</b> 可以构成副词。', en: 'Adverbs come from qualities with -ly.', eg: 'tightly' },
      { zh: '比较级用 <b>more / most</b>，常用词也允许 -er / -est。', en: 'more and most make comparisons; -er/-est appear in common use.', eg: 'more complex → cheaper' },
      { zh: '否定用前缀 <b>un-</b>。', en: 'Negatives are formed with un-.', eg: 'unwise' },
      { zh: '疑问句像普通英语一样用 <b>do</b>。', en: 'Questions use do, as in English.', eg: 'Do you have some?' },
      { zh: '代词与操作词保留英语的变位形式。', en: 'Pronouns and operators keep their English forms.', eg: 'I go to him → He goes to me' },
      { zh: '两个名词，或名词加方位词，可以合成新词。', en: 'Compounds join two nouns, or a noun and a directive.', eg: 'soapbox, sunup' },
      { zh: '国际词、数字、日期、钱币与度量直接用英语形式。', en: 'International words, numbers, dates, money and measures use English forms.', eg: 'radio, 1930, $5' },
      { zh: '技术词加引号写出，并当场用 850 词解释。', en: 'Technical terms go in inverted commas, explained in Basic words.', eg: "the 'vocabulary' is the list of words" }
    ];
    return `
    <div class="wrap-narrow">
      <header class="page-head">
        <h1>语法规则</h1>
        <p class="sub">850 个词不是全部——还要加上这几条小规则，词就能"变形"、"合体"，撑起完整的表达。</p>
      </header>
      <div class="prose" style="max-width:none">
        <ol class="grammar-list">
          ${rules.map(r => `
          <li>
            <div>
              <div>${r.zh}</div>
              <div class="g-en">${r.en}</div>
              <div class="g-eg">${r.eg}</div>
            </div>
          </li>`).join('')}
        </ol>
        <p style="margin-top:22px;color:var(--ink-soft);font-size:14px">整理自 Wikipedia「Basic English」条目对奥格登《General Introduction with Rules and Grammar》(1930) 中语法条款的归纳。</p>
        <p><a class="btn" href="#/expansion">看看这些规则怎么把 850 变成上万词 →</a></p>
      </div>
    </div>`;
  },
  mount() {}
};
