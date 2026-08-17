import { init } from '../shared.js';
import { initWorkFilters } from '../features/work-filters.js';
import { supabase } from '../supabase-client.js';

init();

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function locationLabel(project) {
  return project.location || (project.category === 'commercial' ? 'Commercial - NJ' : 'Residential - NJ');
}

async function loadGrid() {
  const grid = document.getElementById('workGrid');
  if (!supabase) return initWorkFilters();

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });

  if (error || !projects) return initWorkFilters();

  grid.innerHTML = projects.map(project => `
    <a class="proj-card" data-cat="${escapeHtml(project.category)}" href="/work/${escapeHtml(project.slug)}" style="text-decoration:none;display:block;">
      <div class="proj-img">
        <img src="${escapeHtml(project.cover_image_url)}" alt="${escapeHtml(project.title)}">
      </div>
      <div class="proj-body"><h4>${escapeHtml(project.title)}</h4><span>${escapeHtml(locationLabel(project))}</span></div>
    </a>
  `).join('');

  initWorkFilters();
}

loadGrid();
