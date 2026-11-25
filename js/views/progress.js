/* 进度中心 — 统计 / 生词本 / 测验记录 / 设置 */
window.VIEWS = window.VIEWS || {};
VIEWS.progress = {
  title: '学习进度 · 奥格登 850',
  render() {
    return `<div class="wrap"><div id="prog-root"></div></div>`;
  },

  mount(root) {
    const host = root.querySelector('#prog-root');

    function render() {
      const s = Store.stats();
      const byCat = Store.statsByCat(DataIndex.cats);
      const pct = Math.round(s.learned / 850 * 100);
      const due = Store.srsDue().length;
      const scheduled = Store.srsScheduled();

      const starredWords = DataIndex.words.filter(x => Store.isStarred(x.w));
      const log = Store.quizLog();

      host.innerHTML = `
      <header class="page-head">
        <h1>学习进度</h1>
        <p class="sub">数据保存在本机浏览器 localStorage，只属于你。</p>
      </header>

      <div class="stat-grid">
        <div class="stat-cell"><div class="k">已学（含模糊）</div><div class="v">${s.learned}<small> / 850</small></div></div>
        <div class="stat-cell gold"><div class="k">掌握</div><div class="v">${s.mastered}</div></div>
        <div class="stat-cell"><div class="k">模糊</div><div class="v">${s.fuzzy}</div></div>
        <div class="stat-cell"><div class="k">生词本</div><div class="v">${s.starred}</div></div>
        <div class="stat-cell"><div class="k">测验轮数</div><div class="v">${s.quizzes}</div></div>
        <div class="stat-cell"><div class="k">今日到期复习</div><div class="v">${due}</div></div>
        <div class="stat-cell"><div class="k">已排期复习</div><div class="v">${scheduled}</div></div>
      </div>

      ${due ? `<p><a class="btn btn-stamp" href="#/review">有 ${due} 张卡片到期，去复习 →</a></p>` : ''}

      <div class="overall-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
      <p class="words-count-note">总进度 ${pct}%（${s.learned}/850）</p>

      <div class="cat-progress">
        ${DataIndex.cats.map(c => {
          const n = byCat[c.id], p = Math.round(n / c.count * 100);
          return `<div class="cp-row"><span>${c.no} ${c.name}</span><span class="bar"><i style="width:${p}%"></i></span><span class="pct">${n}/${c.count}</span></div>`;
        }).join('')}
      </div>

      <h2 style="font-size:19px;border-bottom:2px solid var(--ink);padding-bottom:8px;margin-top:34px">生词本</h2>
      ${starredWords.length
        ? `<div class="family-grid">${starredWords.map(x => `
            <a class="family-item" href="#/word/${x.id}" style="display:block">
              <span class="fw">${x.w}</span> <span class="fzh">— ${x.zh}</span>
            </a>`).join('')}</div>`
        : '<p class="empty-note">还空着。在词表或详情页点 ☆，难词就会聚到这里。</p>'}

      <h2 style="font-size:19px;border-bottom:2px solid var(--ink);padding-bottom:8px;margin-top:34px">测验记录</h2>
      ${log.length ? `
      <table class="quiz-log">
        <tr><th>日期</th><th>模式</th><th>范围</th><th>得分</th></tr>
        ${log.slice(0, 20).map(r => `
        <tr><td>${r.d}</td><td>${({ en2zh: '英→中', zh2en: '中→英', spell: '拼写' })[r.mode] || r.mode}</td>
        <td>${r.cat === 'all' ? '全部' : (DataIndex.cats.find(c => c.id === r.cat) || {}).name || r.cat}</td>
        <td>${r.score} / ${r.total}</td></tr>`).join('')}
      </table>` : '<p class="empty-note">还没有测验记录——去 <a href="#/quiz">测验</a> 来一轮。</p>'}

      <div class="settings-block">
        <h2 style="font-size:17px">备份与恢复</h2>
        <p style="font-size:14px;color:var(--ink-soft)">把学习进度（含复习排期、生词本、测验记录）导出为 JSON 文件，或在别的设备导入恢复。</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-sm" id="export-btn">导出进度</button>
          <button class="btn btn-sm btn-quiet" id="import-btn">导入进度</button>
          <input type="file" id="import-file" accept=".json,application/json" hidden>
        </div>
      </div>

      <div class="settings-block">
        <h2 style="font-size:17px">设置</h2>
        <p style="font-size:14px;color:var(--ink-soft)">清除所有学习进度、生词本与测验记录（不影响夜间模式设置）。</p>
        <button class="danger-btn" id="reset-btn">清除全部进度</button>
      </div>`;

      const rb = host.querySelector('#reset-btn');
      if (rb) rb.addEventListener('click', () => {
        if (confirm('确定清除全部学习进度？此操作不可撤销。')) {
          Store.resetAll();
          render();
        }
      });

      const eb = host.querySelector('#export-btn');
      if (eb) eb.addEventListener('click', () => {
        const blob = new Blob([Store.exportData()], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'ogden850-backup-' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 500);
      });

      const impBtn = host.querySelector('#import-btn');
      const impFile = host.querySelector('#import-file');
      if (impBtn && impFile) {
        impBtn.addEventListener('click', () => impFile.click());
        impFile.addEventListener('change', async () => {
          const file = impFile.files[0];
          if (!file) return;
          try {
            const data = JSON.parse(await file.text());
            if (confirm('导入会覆盖当前全部进度，确定继续？')) {
              const ok = Store.importData(data);
              alert(ok ? '导入完成。' : '文件格式不对：缺少 learned 字段。');
              render();
            }
          } catch (err) {
            alert('读取失败：这不是有效的 JSON 文件。');
          }
          impFile.value = '';
        });
      }
    }

    render();
    document.addEventListener('store:change', render);
    this.destroy = () => document.removeEventListener('store:change', render);
  }
};
