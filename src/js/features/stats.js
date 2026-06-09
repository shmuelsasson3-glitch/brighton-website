export function initStats(selector) {
  function formatAbbr(n, suffix) {
    if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1).replace(/\.0$/, '') + 'M' + suffix;
    if (n >= 1000) return Math.round(n / 1000) + 'K' + suffix;
    return Math.round(n) + suffix;
  }

  function animateNum(el) {
    if (el.dataset.animating) return;
    if (el.dataset.text) { el.textContent = el.dataset.text; return; }
    el.dataset.animating = '1';
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const abbr = el.dataset.format === 'abbr';
    const dur = 2200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      const val = Math.round(eased * target);
      el.textContent = abbr ? formatAbbr(val, suffix) : val + suffix;
      if (p < 1) { requestAnimationFrame(tick); } else { delete el.dataset.animating; }
    };
    requestAnimationFrame(tick);
  }

  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const el = e.target;
      if (e.isIntersecting) {
        animateNum(el);
      } else if (!el.dataset.text) {
        delete el.dataset.animating;
        el.textContent = '0';
      }
    });
  }, { threshold: 0.55 });

  document.querySelectorAll(selector).forEach(el => statIO.observe(el));
}
