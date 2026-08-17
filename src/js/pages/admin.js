import { supabase } from '../supabase-client.js';

const loginView = document.getElementById('loginView');
const appView = document.getElementById('appView');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

const listView = document.getElementById('listView');
const editorView = document.getElementById('editorView');
const projectRows = document.getElementById('projectRows');
const newProjectBtn = document.getElementById('newProjectBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const deleteProjectBtn = document.getElementById('deleteProjectBtn');
const projectForm = document.getElementById('projectForm');
const formError = document.getElementById('formError');

const coverInput = document.getElementById('coverInput');
const coverPreview = document.getElementById('coverPreview');
const statsList = document.getElementById('statsList');
const addStatBtn = document.getElementById('addStatBtn');
const imagesList = document.getElementById('imagesList');
const galleryInput = document.getElementById('galleryInput');

let currentProjectId = null;
let coverImageUrl = '';
let stats = [];
let images = [];

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

async function adminFetch(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      authorization: `Bearer ${session?.access_token || ''}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

async function uploadFile(file, folder) {
  const { uploadUrl, publicUrl } = await adminFetch('/api/admin/upload', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, contentType: file.type, folder }),
  });
  const putRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'content-type': file.type }, body: file });
  if (!putRes.ok) throw new Error('Upload to storage failed');
  return publicUrl;
}

// --- Auth ---

async function refreshAuthView() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    loginView.hidden = true;
    appView.hidden = false;
    loadProjects();
  } else {
    loginView.hidden = false;
    appView.hidden = true;
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.hidden = true;
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      loginError.textContent = error.message;
      loginError.hidden = false;
      return;
    }
    refreshAuthView();
  } catch (err) {
    loginError.textContent = `Login request failed: ${err.message}. If you have an ad blocker or privacy extension enabled, try disabling it for this site.`;
    loginError.hidden = false;
  }
});

logoutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  refreshAuthView();
});

// --- List ---

async function loadProjects() {
  const projects = await adminFetch('/api/admin/projects');
  projectRows.innerHTML = projects.map(p => `
    <tr>
      <td><img src="${escapeHtml(p.cover_image_url)}" alt=""></td>
      <td>${escapeHtml(p.title)}<br><span class="admin-help">${escapeHtml(p.tag)}</span></td>
      <td>${escapeHtml(p.category)}</td>
      <td>${(p.project_images || []).length}</td>
      <td><span class="admin-badge ${p.is_published ? 'admin-badge-yes' : 'admin-badge-no'}">${p.is_published ? 'Published' : 'Hidden'}</span></td>
      <td class="admin-row-actions">
        <button class="admin-btn admin-btn-ghost admin-btn-sm" data-edit="${p.id}">Edit</button>
      </td>
    </tr>
  `).join('');

  projectRows.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const project = await adminFetch(`/api/admin/projects/${btn.dataset.edit}`);
      openEditor(project);
    });
  });
}

// --- Stats repeater ---

function renderStats() {
  statsList.innerHTML = stats.map((s, i) => `
    <div class="admin-repeater-item">
      <div class="admin-repeater-controls">
        <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" data-stat-up="${i}">&uarr;</button>
        <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" data-stat-down="${i}">&darr;</button>
      </div>
      <div class="admin-grid-2">
        <input placeholder="200+" value="${escapeHtml(s.value)}" data-stat-value="${i}">
        <input placeholder="Trees Installed" value="${escapeHtml(s.label)}" data-stat-label="${i}">
      </div>
      <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" data-stat-remove="${i}">Remove</button>
    </div>
  `).join('');

  statsList.querySelectorAll('[data-stat-value]').forEach(el => {
    el.addEventListener('input', () => { stats[+el.dataset.statValue].value = el.value; });
  });
  statsList.querySelectorAll('[data-stat-label]').forEach(el => {
    el.addEventListener('input', () => { stats[+el.dataset.statLabel].label = el.value; });
  });
  statsList.querySelectorAll('[data-stat-remove]').forEach(el => {
    el.addEventListener('click', () => { stats.splice(+el.dataset.statRemove, 1); renderStats(); });
  });
  statsList.querySelectorAll('[data-stat-up]').forEach(el => {
    el.addEventListener('click', () => { swap(stats, +el.dataset.statUp, -1); renderStats(); });
  });
  statsList.querySelectorAll('[data-stat-down]').forEach(el => {
    el.addEventListener('click', () => { swap(stats, +el.dataset.statDown, 1); renderStats(); });
  });
}

function swap(arr, i, dir) {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

addStatBtn.addEventListener('click', () => {
  if (stats.length >= 4) return;
  stats.push({ value: '', label: '' });
  renderStats();
});

// --- Images repeater ---

function renderImages() {
  imagesList.innerHTML = images.map((img, i) => `
    <div class="admin-repeater-item">
      <img src="${escapeHtml(img.url)}" alt="">
      <div>
        <input placeholder="Description (alt text)" value="${escapeHtml(img.alt || '')}" data-img-alt="${i}" style="width:100%;">
        <div class="admin-repeater-controls" style="flex-direction:row; margin-top:6px;">
          <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" data-img-up="${i}">&uarr;</button>
          <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" data-img-down="${i}">&darr;</button>
        </div>
      </div>
      <button type="button" class="admin-btn admin-btn-danger admin-btn-sm" data-img-remove="${i}">Remove</button>
    </div>
  `).join('');

  imagesList.querySelectorAll('[data-img-alt]').forEach(el => {
    el.addEventListener('input', () => { images[+el.dataset.imgAlt].alt = el.value; });
  });
  imagesList.querySelectorAll('[data-img-remove]').forEach(el => {
    el.addEventListener('click', () => { images.splice(+el.dataset.imgRemove, 1); renderImages(); });
  });
  imagesList.querySelectorAll('[data-img-up]').forEach(el => {
    el.addEventListener('click', () => { swap(images, +el.dataset.imgUp, -1); renderImages(); });
  });
  imagesList.querySelectorAll('[data-img-down]').forEach(el => {
    el.addEventListener('click', () => { swap(images, +el.dataset.imgDown, 1); renderImages(); });
  });
}

galleryInput.addEventListener('change', async () => {
  const slug = document.getElementById('fSlug').value || 'untitled';
  for (const file of galleryInput.files) {
    try {
      const url = await uploadFile(file, `projects/${slug}`);
      images.push({ url, alt: '' });
      renderImages();
    } catch (err) {
      formError.textContent = err.message;
      formError.hidden = false;
    }
  }
  galleryInput.value = '';
});

coverInput.addEventListener('change', async () => {
  const file = coverInput.files[0];
  if (!file) return;
  const slug = document.getElementById('fSlug').value || 'untitled';
  try {
    coverImageUrl = await uploadFile(file, `projects/${slug}`);
    coverPreview.src = coverImageUrl;
    coverPreview.hidden = false;
  } catch (err) {
    formError.textContent = err.message;
    formError.hidden = false;
  }
  coverInput.value = '';
});

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

let slugManuallyEdited = false;
document.getElementById('fSlug').addEventListener('input', () => { slugManuallyEdited = true; });
document.getElementById('fTitle').addEventListener('blur', () => {
  const slugField = document.getElementById('fSlug');
  if (!slugManuallyEdited || !slugField.value) {
    slugField.value = slugify(document.getElementById('fTitle').value);
  }
});

// --- Editor open/close ---

function openEditor(project) {
  formError.hidden = true;
  currentProjectId = project?.id || null;
  slugManuallyEdited = !!project;

  document.getElementById('fTitle').value = project?.title || '';
  document.getElementById('fSlug').value = project?.slug || '';
  document.getElementById('fCategory').value = project?.category || 'residential';
  document.getElementById('fTag').value = project?.tag || '';
  document.getElementById('fLocation').value = project?.location || '';
  document.getElementById('fPublished').checked = project ? project.is_published : true;
  document.getElementById('fCoverPosition').value = project?.cover_image_position || 'center center';
  document.getElementById('fOverviewKicker').value = project?.overview_kicker || '';
  document.getElementById('fOverviewHeading').value = project?.overview_heading || '';
  document.getElementById('fOverviewBody').value = project?.overview_body || '';

  coverImageUrl = project?.cover_image_url || '';
  coverPreview.src = coverImageUrl;
  coverPreview.hidden = !coverImageUrl;

  stats = (project?.project_stats || []).slice().sort((a, b) => a.sort_order - b.sort_order)
    .map(s => ({ value: s.value, label: s.label }));
  images = (project?.project_images || []).slice().sort((a, b) => a.sort_order - b.sort_order)
    .map(i => ({ url: i.url, alt: i.alt }));
  renderStats();
  renderImages();

  deleteProjectBtn.hidden = !project;
  listView.hidden = true;
  editorView.hidden = false;
}

function closeEditor() {
  editorView.hidden = true;
  listView.hidden = false;
  loadProjects();
}

newProjectBtn.addEventListener('click', () => openEditor(null));
cancelEditBtn.addEventListener('click', closeEditor);

projectForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.hidden = true;

  if (!coverImageUrl) {
    formError.textContent = 'A cover image is required.';
    formError.hidden = false;
    return;
  }

  const payload = {
    title: document.getElementById('fTitle').value,
    slug: document.getElementById('fSlug').value,
    category: document.getElementById('fCategory').value,
    tag: document.getElementById('fTag').value,
    location: document.getElementById('fLocation').value,
    is_published: document.getElementById('fPublished').checked,
    cover_image_url: coverImageUrl,
    cover_image_position: document.getElementById('fCoverPosition').value,
    overview_kicker: document.getElementById('fOverviewKicker').value,
    overview_heading: document.getElementById('fOverviewHeading').value,
    overview_body: document.getElementById('fOverviewBody').value,
    stats,
    images,
  };

  try {
    if (currentProjectId) {
      await adminFetch(`/api/admin/projects/${currentProjectId}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await adminFetch('/api/admin/projects', { method: 'POST', body: JSON.stringify(payload) });
    }
    closeEditor();
  } catch (err) {
    formError.textContent = err.message;
    formError.hidden = false;
  }
});

deleteProjectBtn.addEventListener('click', async () => {
  if (!currentProjectId) return;
  if (!confirm('Delete this project? This cannot be undone.')) return;
  try {
    await adminFetch(`/api/admin/projects/${currentProjectId}`, { method: 'DELETE' });
    closeEditor();
  } catch (err) {
    formError.textContent = err.message;
    formError.hidden = false;
  }
});

refreshAuthView();
