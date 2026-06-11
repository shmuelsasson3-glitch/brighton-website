export function initNav() {
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');
  if (!header || !burger || !mobileNav) return;

  const startsSolid = header.classList.contains('solid');

  function syncHeader() {
    header.classList.toggle('solid', startsSolid || window.scrollY > 40);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      syncHeader();
      ticking = false;
    });
  }, { passive: true });
  syncHeader();

  function closeNav() {
    mobileNav.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileNavClose.addEventListener('click', closeNav);

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });
}
