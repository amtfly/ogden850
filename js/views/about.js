/* 关于页 — C. K. 奥格登生平与基础英语体系 */
window.VIEWS = window.VIEWS || {};
VIEWS.about = {
  title: '关于奥格登 · 奥格登 850',
  render() {
    return `
    <div class="wrap-narrow">
      <header class="page-head">
        <h1>查尔斯·凯·奥格登</h1>
        <p class="sub">Charles Kay Ogden（1889 年 6 月 1 日 – 1957 年 3 月 20 日）· 英国语言学家、哲学家、作家</p>
      </header>

      <div class="prose">
        <p>奥格登出生于英格兰兰开夏郡弗利特伍德，靠奖学金进入剑桥大学莫德林学院（Magdalene College）攻读古典学。他是个典型的 polymath（通才）——也被称为怪人和局外人：办杂志、开书店和画廊、编书系、翻译哲学著作，而留名后世的，是他发明的<b>基础英语（Basic English）</b>。</p>
        <p>1909 年，他还是本科生就与人共同创立了剑桥<b>「异端社」（Heretics Society）</b>，质疑传统权威；此后十余年任社长，请来切斯特顿、罗素、维特根斯坦等人演讲。1912 年创办《剑桥杂志》并主编至 1922 年，一战期间因少年时风湿热免役，转而做国际新闻摘要，发行量逾两万份。</p>
        <p>1923 年他与 I. A. 理查兹合著《意义的意义》（<i>The Meaning of Meaning</i>），提出著名的<b>语义三角</b>，成为 20 世纪英国哲学"语言学转向"的重要一步。书中那句"The gostak distims the doshes"至今仍被引用来说明：语法本身也能制造意义。</p>
        <p>1925 年起，推广基础英语成为奥格登余生的主线。1927 年他创立<b>正统语言研究所（Orthological Institute）</b>，所址设在剑桥国王大道。1930 年出版《基础英语：总论、规则与语法》。850 个词加 16 页规则，被设计去做约两万英语词的工作——二战结束后，这套方案一度被视为"世界和平的工具"广为宣传，还影响了美国之音特别英语（VOA Special English）和简化技术英语（STE）。</p>
        <p>他的宏大构想不乏争议：奥格登相信世界应逐渐少用小语种、多用英语；1944 年可读性专家弗莱什在《哈泼斯》杂志上讥讽它"既不 basic 也不 English"；香农在 1948 年的信息论名文中拿它的低词汇量与乔伊斯《芬尼根的守灵夜》的高词汇量对照 redundancy（冗余）。但无可否认的是：850 词表至今仍是全世界（尤其在亚洲）英语入门教学最常用的基础词表之一。</p>

        <div class="triangle-figure" aria-label="语义三角图">
          <svg viewBox="0 0 360 220">
            <polygon points="180,30 40,180 320,180" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <line x1="180" y1="30" x2="180" y2="180" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4"/>
            <text x="180" y="20" text-anchor="middle" font-size="14" font-weight="600">所指 Referent</text>
            <text x="30" y="200" font-size="14" font-weight="600">能指 Symbol</text>
            <text x="330" y="200" text-anchor="end" font-size="14" font-weight="600">思想 Thought</text>
            <text x="186" y="112" font-size="12" fill="var(--ink-soft)">真实关系</text>
            <text x="96" y="100" font-size="12" fill="var(--stamp)">因果关系</text>
            <text x="252" y="100" font-size="12" fill="var(--ink-soft)">示意关系</text>
          </svg>
        </div>
        <p class="fig-caption">奥格登语义三角：词语与事物之间没有直线，必须经过思想。</p>

        <h3 style="margin-top:34px">年表</h3>
        <ul class="timeline">
          <li><span class="yr">1889</span><span class="tx">6 月 1 日生于兰开夏郡弗利特伍德的罗斯奥尔学校，父亲在该校任职。</span></li>
          <li><span class="yr">1908</span><span class="yr" style="display:none"></span><span class="tx">获奖学金进入剑桥莫德林学院读古典学。</span></li>
          <li><span class="yr">1909</span><span class="tx">与人共创剑桥「异端社」，后任社长十余年。</span></li>
          <li><span class="yr">1912</span><span class="tx">创办周刊《剑桥杂志》；赴欧陆考察语言教学法。</span></li>
          <li><span class="yr">1923</span><span class="tx">与理查兹合著《意义的意义》，提出语义三角。</span></li>
          <li><span class="yr">1927</span><span class="tx">创立正统语言研究所（剑桥国王大道）；促成乔伊斯朗读《芬尼根的守灵夜》选段的著名录音。</span></li>
          <li><span class="yr">1930</span><span class="tx">出版《基础英语：总论、规则与语法》，850 词表问世。</span></li>
          <li><span class="yr">1934</span><span class="tx">出版《基础英语体系》；同年名言"世界需要多一门活的语言"。</span></li>
          <li><span class="yr">1943</span><span class="tx">研究所迁至伦敦戈登广场；战时基础英语宣传达到顶峰。</span></li>
          <li><span class="yr">1957</span><span class="tx">3 月 20 日在伦敦一家私人诊所去世，终生未婚；十万册藏书后由 UCLA 购得。</span></li>
        </ul>

        <h3 style="margin-top:28px">主要著作</h3>
        <ul class="book-list">
          <li><span class="yr">1923</span><span class="tx"><span class="bt">The Meaning of Meaning</span><span class="bd">与 I. A. 理查兹合著 · 语义学经典，多次再版</span></span></li>
          <li><span class="yr">1930</span><span class="tx"><span class="bt">Basic English: A General Introduction with Rules and Grammar</span><span class="bd">850 词表与语法规则的奠基之作</span></span></li>
          <li><span class="yr">1932</span><span class="tx"><span class="bt">The Basic Words: A Simple Introduction of Basic English</span><span class="bd">核心词详解（与理查兹）</span></span></li>
          <li><span class="yr">1934</span><span class="tx"><span class="bt">The System of Basic English</span><span class="bd">体系的完整论述</span></span></li>
          <li><span class="yr">1932</span><span class="tx"><span class="bt">Bentham's Theory of Fictions</span><span class="bd">编辑边沁著作 · 虚构主义先驱</span></span></li>
        </ul>

        <blockquote class="quote-block">
          <p class="en">"What the world needs most is about 1,000 more dead languages — and one more alive."</p>
          <p class="zh">"这个世界最需要的，是再死掉一千门语言——和多活一门。"</p>
          <cite>—— C. K. Ogden，《The System of Basic English》（1934）</cite>
        </blockquote>

        <p style="font-size:13.5px;color:var(--ink-soft)">资料来源：Wikipedia「Charles Kay Ogden」「Basic English」条目；奥格登著作原版信息。本站词表以 Simple English Wikipedia 存档的官方 850 词表为准。</p>
        <p style="margin-top:20px"><a class="btn" href="#/words">开始学他的 850 个词 →</a></p>
      </div>
    </div>`;
  },
  mount() {}
};
