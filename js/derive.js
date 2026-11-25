/* 词族派生 — Basic English 的构词规则：850 词根长出更大词族
   规则依据 Ogden《General Introduction》的语法条款。
   只生成真实存在的词形：不规则变化用查表，-ly/-un 只对收录的白名单开放。 */
window.Derive = (function () {
  function ing(w) {
    if (/[^aeiou][aeiou][b-df-hj-np-tv-z]$/.test(w) && !/(w|x|y)$/.test(w)) return w + w + 'ing'; // sit→sitting
    if (w.endsWith('e') && !w.endsWith('ee')) return w.slice(0, -1) + 'ing';                      // make→making
    return w + 'ing';
  }
  function er(w) { return w.endsWith('e') ? w + 'r' : w + 'er'; }
  function plural(w) {
    if (/(s|x|z|ch|sh)$/.test(w)) return w + 'es';
    if (w.endsWith('y') && /[b-df-hj-np-tv-z]/.test(w.slice(-2, -1))) return w.slice(0, -1) + 'ies';
    if (w.endsWith('fe')) return w.slice(0, -2) + 'ves';                                          // knife→knives
    if (/f$/.test(w)) return w.slice(0, -1) + 'ves';                                              // leaf→leaves
    if (/(man|woman)$/.test(w)) return w.replace(/man$/, 'men');
    if (w.endsWith('o')) return w + 'es';                                                          // potato→potatoes
    return w + 's';
  }

  /* 不规则变化查表 */
  const PLURAL_IRREG = { sheep: 'sheep', fish: 'fish', scissors: 'scissors', trousers: 'trousers', foot: 'feet', tooth: 'teeth', goose: 'geese', man: 'men', woman: 'women', child: 'children', mouse: 'mice' };
  const PART_IRREG = { go: 'gone', come: 'come', give: 'given', see: 'seen', take: 'taken', get: 'got', make: 'made', say: 'said', have: 'had', do: 'done', keep: 'kept', send: 'sent', let: 'let', put: 'put', cut: 'cut', burst: 'burst', build: 'built', burn: 'burnt', feel: 'felt', keep2: 0 };
  const ER_IRREG = { cry: 'crier', library: 'librarian', office: 'officer' };

  /* 可完整派生 -ing/-ed/-er 的动词性词条（操作词 + 词表中的动词性名词） */
  const VERBS = new Set([
    'come', 'get', 'give', 'go', 'keep', 'make', 'put', 'say', 'see', 'send', 'take', 'do',
    'act', 'attack', 'attempt', 'balance', 'bite', 'blow', 'brush', 'burn', 'burst', 'care', 'cause', 'change',
    'cook', 'copy', 'crack', 'crush', 'cry', 'cut', 'damage', 'design', 'desire', 'drink', 'drive', 'dry', 'dust',
    'edge', 'exchange', 'experience', 'fear', 'fight', 'fire', 'fold', 'form', 'frame', 'grip', 'guide',
    'hate', 'help', 'hook', 'increase', 'iron', 'join', 'jump', 'kick', 'kiss', 'laugh', 'lead', 'lift',
    'light', 'limit', 'list', 'lock', 'look', 'love', 'mark', 'match', 'measure', 'milk', 'mind', 'move',
    'name', 'need', 'note', 'offer', 'paint', 'paste', 'pin', 'pipe', 'place', 'plant', 'plate', 'play',
    'point', 'poison', 'polish', 'print', 'process', 'produce', 'protest', 'pull', 'pump', 'push',
    'range', 'rate', 'record', 'request', 'rest', 'reward', 'ring', 'roll', 'roof', 'root', 'rub', 'rule', 'run',
    'sail', 'scale', 'seat', 'shade', 'shake', 'sign', 'slip', 'smash', 'smell', 'smile', 'smoke', 'sneeze',
    'snow', 'soap', 'sort', 'sound', 'start', 'steam', 'step', 'stick', 'stop', 'stretch', 'support', 'surprise',
    'swim', 'talk', 'taste', 'tax', 'test', 'thunder', 'touch', 'train', 'transport', 'trick', 'trouble',
    'turn', 'twist', 'use', 'view', 'walk', 'wash', 'watch', 'wave', 'wax', 'whip', 'whistle', 'work', 'wound'
  ]);
  /* 名词 → 从业者 -er（只加 -er，不加 -ing/-ed） */
  const AGENT_ONLY = new Set(['prison', 'farm', 'garden']);

  /* 质量形容词 → -ly 副词（白名单：只收录真实副词） */
  const LY_OK = new Set(['angry', 'bright', 'certain', 'cheap', 'clean', 'clear', 'cold', 'common', 'cruel', 'dark', 'dead', 'dear', 'deep', 'different', 'dirty', 'dry', 'equal', 'feeble', 'foolish', 'frequent', 'general', 'great', 'happy', 'hard', 'healthy', 'high', 'kind', 'late', 'loose', 'loud', 'low', 'natural', 'necessary', 'new', 'normal', 'poor', 'probable', 'public', 'quick', 'quiet', 'rough', 'sad', 'safe', 'secret', 'serious', 'sharp', 'short', 'simple', 'slow', 'small', 'smooth', 'soft', 'special', 'sticky', 'stiff', 'strong', 'sudden', 'sweet', 'thick', 'thin', 'tight', 'tired', 'true', 'violent', 'warm', 'wet', 'wide', 'wise', 'wrong', 'young']);
  const LY_IRREG = { true: 'truly', public: 'publicly', simple: 'simply', probable: 'probably', feeble: 'feebly', happy: 'happily', angry: 'angrily' };

  /* 质量形容词 → un- 否定（白名单：只收录真实反义词） */
  const UN_OK = new Set(['able', 'certain', 'clean', 'clear', 'common', 'conscious', 'equal', 'happy', 'healthy', 'important', 'kind', 'natural', 'necessary', 'safe', 'true', 'wise']);

  /* 合成词示例（两名词 / 名词+方位词，均为真实常用词） */
  const COMPOUNDS = [
    ['sun', 'light', 'sunlight', '阳光'], ['bed', 'room', 'bedroom', '卧室'], ['black', 'board', 'blackboard', '黑板'],
    ['book', 'case', 'bookcase', '书柜'], ['foot', 'ball', 'football', '足球'], ['house', 'work', 'housework', '家务'],
    ['note', 'book', 'notebook', '笔记本'], ['rain', 'bow', 'rainbow', '彩虹'], ['school', 'boy', 'schoolboy', '男生'],
    ['snow', 'man', 'snowman', '雪人'], ['sun', 'day', 'sunday', '星期日'], ['tooth', 'brush', 'toothbrush', '牙刷'],
    ['water', 'fall', 'waterfall', '瀑布'], ['moon', 'light', 'moonlight', '月光'], ['birth', 'day', 'birthday', '生日'],
    ['door', 'bell', 'doorbell', '门铃'], ['eye', 'glass', 'eyeglass', '眼镜'], ['fire', 'place', 'fireplace', '壁炉'],
    ['hand', 'bag', 'handbag', '手提包'], ['home', 'work', 'homework', '家庭作业'], ['horse', 'back', 'horseback', '马背'],
    ['key', 'hole', 'keyhole', '锁孔'], ['life', 'boat', 'lifeboat', '救生艇'], ['night', 'fall', 'nightfall', '黄昏'],
    ['pen', 'knife', 'penknife', '铅笔刀'], ['post', 'card', 'postcard', '明信片'], ['sea', 'shore', 'seashore', '海岸'],
    ['shop', 'keeper', 'shopkeeper', '店主'], ['snow', 'storm', 'snowstorm', '暴风雪'], ['steam', 'boat', 'steamboat', '汽船'],
    ['watch', 'tower', 'watchtower', '瞭望塔'], ['week', 'day', 'weekday', '工作日'], ['wind', 'mill', 'windmill', '风车'],
    ['wood', 'work', 'woodwork', '木工活'], ['glass', 'house', 'glasshouse', '温室'], ['grass', 'hopper', 'grasshopper', '蚱蜢'],
    ['hair', 'brush', 'hairbrush', '发刷'], ['head', 'ache', 'headache', '头痛'], ['ink', 'pot', 'inkpot', '墨水瓶'],
    ['lamp', 'shade', 'lampshade', '灯罩'], ['meat', 'ball', 'meatball', '肉丸'], ['over', 'coat', 'overcoat', '大衣'],
    ['play', 'thing', 'plaything', '玩物'], ['shoe', 'lace', 'shoelace', '鞋带'], ['soap', 'box', 'soapbox', '肥皂箱'],
    ['star', 'light', 'starlight', '星光'], ['tooth', 'ache', 'toothache', '牙痛'], ['water', 'proof', 'waterproof', '防水的'],
    ['wheel', 'barrow', 'wheelbarrow', '独轮车'], ['sun', 'up', 'sunup', '日出']
  ];

  const NOUNISH = e => ['things', 'pict'].includes(e.cat);

  /* 给单个词根生成词族 */
  function familyOf(entry) {
    const w = entry.w;
    const f = [];
    if (NOUNISH(entry)) {
      const pl = PLURAL_IRREG[w] || plural(w);
      if (pl !== w) f.push({ rule: '复数', word: pl, zh: entry.zh.split('；')[0] + '（复数）' });
    }
    if (VERBS.has(w)) {
      f.push({ rule: '动名词 -ing', word: ing(w), zh: entry.zh.split('；')[0] + '（进行 / 动名词）' });
      const part = PART_IRREG[w] || ed(w);
      f.push({ rule: w in PART_IRREG ? '过去分词（不规则）' : '过去分词 -ed', word: part, zh: entry.zh.split('；')[0] + '（完成 / 被动）' });
      const agent = ER_IRREG[w] || er(w);
      f.push({ rule: ER_IRREG[w] ? '施动者（不规则）' : '施动者 -er', word: agent, zh: entry.zh.split('；')[0] + '的人 / 物' });
    }
    if (AGENT_ONLY.has(w)) {
      f.push({ rule: '从业者 -er', word: er(w), zh: entry.zh.split('；')[0] + '相关的人' });
    }
    if (LY_OK.has(w)) {
      f.push({ rule: '副词 -ly', word: LY_IRREG[w] || ly(w), zh: entry.zh.split('；')[0] + '地' });
    }
    if (UN_OK.has(w)) {
      f.push({ rule: '否定 un-', word: 'un' + w, zh: '不' + entry.zh.split('；')[0] });
    }
    return f;
  }

  function ed(w) {
    if (/[^aeiou][aeiou][b-df-hj-np-tv-z]$/.test(w) && !/(w|x|y)$/.test(w)) return w + w + 'ed';
    if (w.endsWith('e')) return w + 'd';
    if (w.endsWith('y') && /[b-df-hj-np-tv-z]/.test(w.slice(-2, -1))) return w.slice(0, -1) + 'ied';
    return w + 'ed';
  }
  function ly(w) {
    if (w.endsWith('le')) return w.slice(0, -2) + 'ly';   // simple→simply
    if (w.endsWith('y') && /[b-df-hj-np-tv-z]/.test(w.slice(-2, -1))) return w.slice(0, -1) + 'ily'; // happy→happily
    return w + 'ly';
  }

  /* 全局统计：850 词根按规则长出多少词形 */
  function globalCount() {
    let pl = 0, ing = 0, part = 0, ag = 0, ly = 0, un = 0;
    DataIndex.words.forEach(e => {
      const w = e.w;
      if (NOUNISH(e) && (PLURAL_IRREG[w] || plural(w)) !== w) pl++;
      if (VERBS.has(w)) { ing++; part++; ag++; }
      if (AGENT_ONLY.has(w)) ag++;
      if (LY_OK.has(w)) ly++;
      if (UN_OK.has(w)) un++;
    });
    return { pl, ing, part, ag, ly, un, compounds: COMPOUNDS.length,
      get total() { return this.pl + this.ing + this.part + this.ag + this.ly + this.un + this.compounds; } };
  }

  function compounds() { return COMPOUNDS; }

  return { familyOf, globalCount, compounds };
})();
