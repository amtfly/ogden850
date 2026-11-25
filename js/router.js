/* Hash 路由 — 形如原站的 #/ 风格 */
window.Router = (function () {
  const routes = [];   // {segs:['word',':id'], view}
  const fallback = {
    title: '建设中 · 奥格登 850',
    render: () => '<div class="stub wrap">这一页还没有修好——请先看别处。</div>',
    mount: () => {}
  };

  function add(pattern, view) {
    routes.push({ segs: pattern.split('/').filter(Boolean), view });
  }

  function currentHash() {
    return location.hash.replace(/^#\/?/, '');
  }

  function splitPath(hash) {
    const [pathPart, queryPart] = hash.split('?');
    const segs = pathPart.split('/').filter(Boolean);
    const query = {};
    if (queryPart) {
      queryPart.split('&').forEach(kv => {
        const [k, v] = kv.split('=');
        if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || '');
      });
    }
    return { segs, query };
  }

  function resolve(hash) {
    const { segs, query } = splitPath(hash);
    for (const r of routes) {
      if (r.segs.length !== segs.length) continue;
      const params = {};
      let ok = true;
      r.segs.forEach((s, i) => {
        if (s.startsWith(':')) params[s.slice(1)] = segs[i];
        else if (s !== segs[i]) ok = false;
      });
      if (ok) return { view: r.view, params, query };
    }
    return { view: fallback, params: {}, query };
  }

  let mounted = null;

  function render() {
    const hash = currentHash();
    const { view, params, query } = resolve(hash);
    const main = document.getElementById('main');
    if (mounted && mounted.destroy) { try { mounted.destroy(); } catch (e) {} }
    main.innerHTML = view.render(params, query);
    view.mount && view.mount(main, params, query);
    mounted = view;
    document.title = view.title || '奥格登 850 · 基础英语词库';
    const top = hash.split('/')[0] || 'home';
    document.querySelectorAll('[data-route]').forEach(a => {
      a.classList.toggle('active', a.dataset.route === top);
    });
    window.scrollTo(0, 0);
  }

  function start() {
    window.addEventListener('hashchange', render);
    if (!location.hash) location.hash = '#/';
    render();
  }
  function go(path) { location.hash = path; }

  return { add, start, go, render };
})();
