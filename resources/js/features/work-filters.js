export function initWorkFilters() {
  function applyFilter(f) {
    document.querySelectorAll('.wfilter').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.wfilter[data-filter="${f}"]`) || document.querySelector('.wfilter[data-filter="all"]');
    if (btn) btn.classList.add('active');
    document.querySelectorAll('#workGrid .proj-card').forEach(c => {
      c.classList.toggle('hidden', f !== 'all' && c.dataset.cat !== f);
    });
  }

  document.querySelectorAll('.wfilter').forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  const urlFilter = new URLSearchParams(location.search).get('filter');
  applyFilter(urlFilter || 'residential');
}
