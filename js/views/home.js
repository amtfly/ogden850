/* 首页 */
window.VIEWS = window.VIEWS || {};
VIEWS.home = {
  title: '奥格登 850 · 基础英语词库',
  render() {
    const cats = (window.DataIndex && DataIndex.cats) || [];
    const dueCount = (window.Store && Store.srsDue) ? Store.srsDue().length : 0;
    const cells = cats.map(c => `
      <a class="count-cell" href="#/words?cat=${c.id}" title="查看${c.name} ${c.count} 词">
        <span class="no">${c.no}</span>
        <span class="num">${c.count}</span>
        <span class="lbl">${c.name}</span>
        <span class="en">${c.en}</span>
      </a>`).join('');

    return `
    <section class="hero wrap">
      <p class="hero-attrib">查尔斯·凯·奥格登 Charles Kay Ogden（1889–1957）· 剑桥 · 1930 年</p>
      <div class="hero-lockup">
        <div class="hero-number">850</div>
        <div class="hero-side">
          <h1>八百五十个词，撑起一门语言。</h1>
          <p class="hero-lede">基础英语（Basic English）是奥格登把英语压缩到极限的产物：850 个核心词，16 条语法规则，不背动词变位，靠 18 个"操作词"推动句子。词汇少了，能说的事却没有少。</p>
          <div class="hero-actions">
            <a class="btn btn-solid" href="#/words">浏览 850 词表</a>
            <a class="btn" href="#/about">奥格登的故事</a>
          </div>
        </div>
        <svg class="hero-stamp" viewBox="0 0 140 140" aria-hidden="true">
          <defs><path id="stamp-arc" d="M70,70 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0"/></defs>
          <circle cx="70" cy="70" r="66" fill="none" stroke="currentColor" stroke-width="3"/>
          <circle cx="70" cy="70" r="38" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <text font-size="13.5" letter-spacing="3.2" fill="currentColor" font-weight="600">
            <textPath href="#stamp-arc" startOffset="0">OGDEN'S BASIC ENGLISH · EST. 1930 ·</textPath>
          </text>
          <text x="70" y="78" text-anchor="middle" font-size="26" font-weight="600" fill="currentColor">850</text>
        </svg>
      </div>
      <div class="count-table">
        ${cells}
        <div class="count-total">
          <span class="lbl">合计 Total vocabulary</span>
          <span class="num">850 词</span>
        </div>
      </div>
    </section>

    <section class="home-section wrap">
      <h2>五张词单 <span class="en">The five word lists</span></h2>
      <ul class="rowlist">
        ${cats.map(c => `
        <li><a href="#/words?cat=${c.id}">
          <span class="rl-lead">${c.no}　${c.name}</span>
          <span class="rl-desc">${c.desc}</span>
          <span class="rl-go">${c.count} 词</span>
        </a></li>`).join('')}
        <li><a href="#/words?cat=intl">
          <span class="rl-lead">附　国际词</span>
          <span class="rl-desc">各欧洲语言通用的补充词汇，奥格登假定学习者已认识，不计入 850。</span>
          <span class="rl-go">${DataIndex.intlCount} 词</span>
        </a></li>
      </ul>
    </section>

    <section class="home-section wrap">
      <h2>学起来 <span class="en">Start learning</span></h2>
      <ul class="rowlist">
        <li><a href="#/flashcards">
          <span class="rl-lead">闪卡记忆</span>
          <span class="rl-desc">翻卡自测，标记"掌握 / 模糊"，从上次停下的地方继续。</span>
          <span class="rl-go">去翻卡</span>
        </a></li>
        <li><a href="#/quiz">
          <span class="rl-lead">测验</span>
          <span class="rl-desc">中英双向选择题与拼写练习，成绩记入进度。</span>
          <span class="rl-go">去测验</span>
        </a></li>
        <li><a href="#/review">
          <span class="rl-lead">复习</span>
          <span class="rl-desc">间隔重复队列：学过的词按记忆曲线排期，到期自动出现${dueCount ? `，今天有 ${dueCount} 张到期` : ''}。</span>
          <span class="rl-go">去复习</span>
        </a></li>
        <li><a href="#/expansion">
          <span class="rl-lead">词族扩展</span>
          <span class="rl-desc">看 850 个词根如何靠 -s、-er、-ing、-ed、-ly、un- 与合成规则长出上万词。</span>
          <span class="rl-go">看扩展</span>
        </a></li>
        <li><a href="#/progress">
          <span class="rl-lead">学习进度</span>
          <span class="rl-desc">分类进度、测验记录，数据保存在本机浏览器。</span>
          <span class="rl-go">看进度</span>
        </a></li>
      </ul>
      <blockquote class="quote-block">
        <p class="en">"What the world needs most is about 1,000 more dead languages — and one more alive."</p>
        <p class="zh">"这个世界最需要的，是再死掉一千门语言——和多活一门。"</p>
        <cite>—— C. K. Ogden，《The System of Basic English》（1934）</cite>
      </blockquote>
    </section>`;
  },
  mount() {}
};
