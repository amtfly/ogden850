/* 数据索引 — 归一化 850 词，提供分类 / 查询 / 搜索 */
(function () {
  const D = window.OGDEN_DATA;
  /* 合并分片的音标与例句表 */
  const PHONETICS = Object.assign({}, D.phonetics, D.phonetics2);
  const EXAMPLES = Object.assign({}, D.examplesA, D.examplesB, D.examplesC);
  const CATS = [
    { id: 'ops',    no: 'Ⅰ', name: '操作词',       en: 'Operations',        key: 'operations', desc: '动词、方位词与连接词，句子的发动机——奥格登不叫它们动词，叫"操作词"。' },
    { id: 'things', no: 'Ⅱ', name: '名词·通用',    en: 'Things',            key: 'things',     desc: '一般事物与抽象概念，从"空气"到"政府"。' },
    { id: 'pict',   no: 'Ⅲ', name: '名词·可见',    en: 'Picturable things', key: 'picturable', desc: '画得出来的具体事物，最适合配图记忆。' },
    { id: 'qual',   no: 'Ⅳ', name: '形容词·一般',  en: 'Qualities',         key: 'qualities',  desc: '描写性质与状态的一般形容词。' },
    { id: 'oppo',   no: 'Ⅴ', name: '形容词·反义',  en: 'Opposites',         key: 'opposites',  desc: '成对出现的反义形容词，与第Ⅳ张词单互补。' }
  ];

  const words = [];
  function add(list, catId, catNo) {
    list.forEach((r, i) => {
      if (catId === 'oppo') {
        /* opposites: [单词, 中文, 词表内反义词] */
        words.push({ id: catId + '-' + i, w: r[0], zh: r[1], cat: catId, catNo, grp: '反义形容词', ex: EXAMPLES[r[0]] || null, ipa: PHONETICS[r[0]] || null, opp: r[2] || null });
      } else {
        words.push({ id: catId + '-' + i, w: r[0], zh: r[1], cat: catId, catNo, grp: r[2] || null, ex: r[3] || EXAMPLES[r[0]] || null, ipa: PHONETICS[r[0]] || null, opp: null });
      }
    });
  }
  CATS.forEach(c => add(D[c.key], c.id, c.no));

  /* 反义词回链：把 good.opp = bad 也补上 */
  const byWord = new Map(words.map(x => [x.w, x]));
  words.forEach(x => {
    if (x.opp && byWord.has(x.opp)) {
      const o = byWord.get(x.opp);
      if (!o.opp) o.opp = x.w;
    }
  });

  const cats = CATS.map(c => {
    const ws = words.filter(x => x.cat === c.id);
    return Object.assign({}, c, { words: ws, count: ws.length });
  });
  const alphabetical = words.slice().sort((a, b) =>
    a.w.toLowerCase().localeCompare(b.w.toLowerCase(), 'en')
  );

  /* 国际词补充清单（不在 850 内） */
  const intl = (D.international || []).map((r, i) => ({
    id: 'intl-' + i, w: r[0], zh: r[1], cat: 'intl', catNo: '附',
    grp: '国际词', ex: null, ipa: PHONETICS[r[0]] || null, opp: null
  }));

  function search(q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    return words.filter(x =>
      x.w.toLowerCase().includes(q) || x.zh.includes(q)
    ).slice(0, 200);
  }

  window.DataIndex = { words, cats, alphabetical, intl, byWord, search, count: words.length, intlCount: intl.length };
})();
