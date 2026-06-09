export function initNav(options = {}) {
  const isSnow = options.variant === 'snow';
  const logo = isSnow ? 'assets/images/snow-logo-crop.png' : 'assets/images/logo.png';
  const logoAlt = isSnow ? 'Brighton Snow Division' : 'Brighton Lawn & Landscape';
  const ctaText = isSnow ? 'Get a Snow Contract' : 'Get a Quote';
  const ctaHref = 'index.html#contact';
  const closeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  const navContainer = document.getElementById('site-nav');
  if (!navContainer) return;

  navContainer.innerHTML = `
<header id="header">
  <div class="header-inner">
    <a href="index.html" class="brand"><img src="${logo}" alt="${logoAlt}"></a>
    <nav class="nav">
      <a href="residential.html">Residential</a>
      <a href="commercial.html">Commercial</a>
      <a href="sitework.html">Site Work</a>
      <a href="snow.html">Snow &amp; Ice</a>
      <a href="index.html#about">About</a>
      <a href="${ctaHref}" class="nav-btn">${ctaText}</a>
    </nav>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="mobile-nav" id="mobileNav">
  <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu">${closeIcon}</button>
  <a href="residential.html">Residential</a>
  <a href="commercial.html">Commercial</a>
  <a href="sitework.html">Site Work</a>
  <a href="snow.html">Snow &amp; Ice</a>
  <a href="index.html#about">About</a>
  <a href="${ctaHref}" class="nav-btn">${ctaText}</a>
</div>`;

  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');

  const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
  if (!isIndex) {
    header.classList.add('solid');
  }

  window.addEventListener('scroll', () => {
    header.classList.toggle('solid', window.scrollY > 40);
    if (!isIndex) header.classList.add('solid');
  });

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

  const path = window.location.pathname;
  navContainer.querySelectorAll('.nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.includes('#') && path.endsWith(href)) {
      link.classList.add('active');
    }
  });
}
