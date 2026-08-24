import { ASSET_BASE_URL } from '../shared.js';

export function initNav(options = {}) {
  const isSnow = options.variant === 'snow';
  const logo = isSnow ? `${ASSET_BASE_URL}/assets/images/snow-logo-crop.png` : `${ASSET_BASE_URL}/assets/images/logo.png`;
  const logoAlt = isSnow ? 'Brighton Snow Division' : 'Brighton Lawn & Landscape';
  const ctaText = isSnow ? 'Get a Snow Contract' : 'Get a Quote';
  const ctaHref = '/#contact';
  const closeIcon = `<i class="fa-solid fa-xmark"></i>`;

  const navContainer = document.getElementById('site-nav');
  if (!navContainer) return;

  navContainer.innerHTML = `
<header id="header">
  <div class="header-inner">
    <a href="/" class="brand"><img src="${logo}" alt="${logoAlt}"></a>
    <nav class="nav">
      <a href="/residential">Residential</a>
      <a href="/commercial">Commercial</a>
      <a href="/sitework">Site Work</a>
      <a href="/snow">Snow &amp; Ice</a>
      <a href="/videos">Videos</a>
      <a href="/#about">About</a>
      <a href="${ctaHref}" class="nav-btn">${ctaText}</a>
    </nav>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="mobile-nav" id="mobileNav">
  <button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu">${closeIcon}</button>
  <a href="/residential">Residential</a>
  <a href="/commercial">Commercial</a>
  <a href="/sitework">Site Work</a>
  <a href="/snow">Snow &amp; Ice</a>
  <a href="/videos">Videos</a>
  <a href="/#about">About</a>
  <a href="${ctaHref}" class="nav-btn">${ctaText}</a>
</div>`;

  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');

  const isIndex = window.location.pathname === '/' || window.location.pathname === '/index'
    || window.location.pathname.endsWith('/index.html');
  if (!isIndex) {
    header.classList.add('solid');
  }

  function syncHeader() {
    header.classList.toggle('solid', window.scrollY > 40);
    if (!isIndex) header.classList.add('solid');
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

  const path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  navContainer.querySelectorAll('.nav a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.includes('#') && path === href) {
      link.classList.add('active');
    }
  });
}
