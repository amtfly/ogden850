/* 应用入口 — 注册路由、主题、页眉进度 */
(function () {
  /* 路由注册 */
  Router.add('', VIEWS.home);
  Router.add('words', VIEWS.words);
  Router.add('word/:id', VIEWS.word);
  Router.add('flashcards', VIEWS.flashcards);
  Router.add('quiz', VIEWS.quiz);
  Router.add('expansion', VIEWS.expansion);
  Router.add('grammar', VIEWS.grammar);
  Router.add('about', VIEWS.about);
  Router.add('progress', VIEWS.progress);

  /* 主题 */
  const themeBtn = document.getElementById('theme-toggle');
  function applyTheme(t) {
    document.documentElement.dataset.theme = t || '';
    themeBtn.textContent = t === 'dark' ? '日间' : '夜间';
  }
  applyTheme(Store.getTheme());
  themeBtn.addEventListener('click', () => {
    const next = Store.getTheme() === 'dark' ? '' : 'dark';
    Store.setTheme(next);
    applyTheme(next);
  });

  /* 页眉进度 */
  const progEl = document.getElementById('head-progress');
  function refreshHeadProgress() {
    const s = Store.stats();
    const num = document.getElementById('head-progress-num');
    if (num) {
      num.textContent = s.learned;
      progEl.classList.toggle('done', s.learned >= 850);
      progEl.title = `已学 ${s.learned} / 850（掌握 ${s.mastered}）`;
    }
  }
  document.addEventListener('store:change', refreshHeadProgress);
  refreshHeadProgress();

  Router.start();
})();
