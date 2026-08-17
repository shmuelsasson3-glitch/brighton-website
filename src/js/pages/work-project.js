import { init } from '../shared.js';
import { initGallery } from '../features/gallery.js';
import { supabase } from '../supabase-client.js';

init();

// Netlify's 200 rewrites change what content is served for a URL, but the
// browser's address bar (and window.location) still shows the original path
// with no query string — so the slug has to be read from the path itself.
const LEGACY_SLUG_MAP = {
  '/arlington-project.html': 'arlington',
  '/baker-project.html': 'baker',
  '/bates-road.html': 'bates-road',
  '/beige-project.html': 'beige',
  '/corner-project.html': 'corner',
  '/pool-patio.html': 'jacks-way',
  '/scotchway-project.html': 'scotchway',
  '/sukkah-project.html': 'sukkah',
  '/toras-aron-project.html': 'toras-aron',
  '/vanard-project.html': 'vanard',
};

function resolveSlug() {
  const path = window.location.pathname;
  if (LEGACY_SLUG_MAP[path]) return LEGACY_SLUG_MAP[path];
  const match = path.match(/^\/work\/([^/]+)\/?$/);
  if (match) return decodeURIComponent(match[1]);
  return new URLSearchParams(window.location.search).get('slug');
}

const slug = resolveSlug();

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// Renders text containing only literal <em>...</em> markers (the site's "green accent" style)
// as real <em> elements, without parsing any other HTML — safe against injection.
function renderEmphasis(el, text) {
  el.textContent = '';
  if (!text) return;
  const parts = text.split(/(<em>|<\/em>)/);
  let target = el;
  for (const part of parts) {
    if (part === '<em>') {
      const em = document.createElement('em');
      el.appendChild(em);
      target = em;
    } else if (part === '</em>') {
      target = el;
    } else if (part) {
      target.appendChild(document.createTextNode(part));
    }
  }
}

function showNotFound() {
  document.getElementById('pageTitle').textContent = 'Project Not Found - Brighton Lawn & Landscape';
  document.getElementById('projTitle').textContent = 'Project Not Found';
  document.getElementById('projTag').textContent = '';
  const gallerySection = document.querySelector('.proj-gallery');
  if (gallerySection) gallerySection.hidden = true;
}

function renderProject(project) {
  document.getElementById('pageTitle').textContent = `${project.title} - Brighton Lawn & Landscape`;

  const heroImg = document.getElementById('projHeroImg');
  heroImg.src = project.cover_image_url;
  heroImg.alt = project.title;
  heroImg.style.objectPosition = project.cover_image_position || 'center 40%';

  document.getElementById('projTag').textContent = project.tag;
  document.getElementById('projTitle').textContent = project.title;

  const overviewSection = document.getElementById('projOverview');
  if (project.overview_heading || project.overview_body) {
    overviewSection.hidden = false;
    document.getElementById('overviewKicker').textContent = project.overview_kicker || 'About the Project';
    renderEmphasis(document.getElementById('overviewHeading'), project.overview_heading);
    document.getElementById('overviewBody').textContent = project.overview_body || '';

    const statsRow = document.getElementById('statsRow');
    const stats = (project.project_stats || []).slice().sort((a, b) => a.sort_order - b.sort_order);
    statsRow.innerHTML = stats.map(stat => `
      <div class="proj-stat-box">
        <div class="proj-stat-num">${escapeHtml(stat.value)}</div>
        <div class="proj-stat-label">${escapeHtml(stat.label)}</div>
      </div>
    `).join('');
  }

  const images = (project.project_images || []).slice().sort((a, b) => a.sort_order - b.sort_order);
  const galleryCols = document.getElementById('galleryCols');
  galleryCols.innerHTML = images.map(img => `
    <div class="gallery-item">
      <img src="${escapeHtml(img.url)}" alt="${escapeHtml(img.alt || project.title)}">
      <div class="gallery-item-overlay">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
      </div>
    </div>
  `).join('');

  initGallery(images.map(img => img.url));
}

async function loadProject() {
  if (!slug || !supabase) return showNotFound();

  const { data, error } = await supabase
    .from('projects')
    .select('*, project_stats(*), project_images(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) return showNotFound();
  renderProject(data);
}

loadProject();
