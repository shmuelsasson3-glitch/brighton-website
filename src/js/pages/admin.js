import { supabase } from '../supabase-client.js';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { initVideoLightbox, openVideo } from '../features/video-player.js';

initVideoLightbox();

const loginView = document.getElementById('loginView');
const appView = document.getElementById('appView');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

const listView = document.getElementById('listView');
const editorView = document.getElementById('editorView');
const passwordView = document.getElementById('passwordView');
const changePasswordBtn = document.getElementById('changePasswordBtn');
const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
const passwordForm = document.getElementById('passwordForm');
const passwordError = document.getElementById('passwordError');
const passwordSuccess = document.getElementById('passwordSuccess');
const projectRows = document.getElementById('projectRows');
const newProjectBtn = document.getElementById('newProjectBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const deleteProjectBtn = document.getElementById('deleteProjectBtn');
const projectForm = document.getElementById('projectForm');
const formError = document.getElementById('formError');

const coverInput = document.getElementById('coverInput');
const coverPreview = document.getElementById('coverPreview');
const cropCoverBtn = document.getElementById('cropCoverBtn');
const coverProgress = document.getElementById('coverProgress');
const coverProgressFill = document.getElementById('coverProgressFill');
const coverProgressLabel = document.getElementById('coverProgressLabel');
const statsList = document.getElementById('statsList');
const addStatBtn = document.getElementById('addStatBtn');
const imagesList = document.getElementById('imagesList');
const galleryInput = document.getElementById('galleryInput');
const galleryProgress = document.getElementById('galleryProgress');
const galleryProgressFill = document.getElementById('galleryProgressFill');
const galleryProgressLabel = document.getElementById('galleryProgressLabel');

const tabProjectsBtn = document.getElementById('tabProjectsBtn');
const tabVideosBtn = document.getElementById('tabVideosBtn');
const tabBackgroundsBtn = document.getElementById('tabBackgroundsBtn');
const projectsSection = document.getElementById('projectsSection');
const videosSection = document.getElementById('videosSection');
const backgroundsSection = document.getElementById('backgroundsSection');
const backgroundRows = document.getElementById('backgroundRows');
const backgroundFormError = document.getElementById('backgroundFormError');
const videoRows = document.getElementById('videoRows');
const newVideoTitle = document.getElementById('newVideoTitle');
const newVideoDate = document.getElementById('newVideoDate');
const newVideoInput = document.getElementById('newVideoInput');
const newVideoThumbnail = document.getElementById('newVideoThumbnail');
const addVideoBtn = document.getElementById('addVideoBtn');
const videoFormError = document.getElementById('videoFormError');
const videoUploadProgress = document.getElementById('videoUploadProgress');
const videoUploadProgressFill = document.getElementById('videoUploadProgressFill');
const videoUploadProgressLabel = document.getElementById('videoUploadProgressLabel');

const cropModal = document.getElementById('cropModal');
const cropImage = document.getElementById('cropImage');
const cropError = document.getElementById('cropError');
const cropRotateLeft = document.getElementById('cropRotateLeft');
const cropRotateRight = document.getElementById('cropRotateRight');
const cropReset = document.getElementById('cropReset');
const cropCancel = document.getElementById('cropCancel');
const cropSave = document.getElementById('cropSave');

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

// Uploads a single file to R2 via a presigned URL, reporting byte-level
// progress through onProgress(loadedBytes) so batches can show a real progress bar.
function putWithProgress(uploadUrl, file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('content-type', file.type);
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) onProgress(e.loaded);
    });
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error('Upload to storage failed'));
    });
    xhr.addEventListener('error', () => reject(new Error('Upload to storage failed')));
    xhr.send(file);
  });
}

async function uploadFile(file, folder, onProgress) {
  const { uploadUrl, publicUrl } = await adminFetch('/api/admin/upload', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, contentType: file.type, folder }),
  });
  await putWithProgress(uploadUrl, file, onProgress || (() => {}));
  return publicUrl;
}

// Uploads multiple files sequentially, tracking combined byte progress across
// the whole batch so a single progress bar can represent "how long it's taking."
async function uploadFilesWithProgress(files, folder, { fill, label }) {
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  let bytesDoneBeforeCurrent = 0;
  const urls = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    label.textContent = `Uploading photo ${i + 1} of ${files.length}...`;
    const url = await uploadFile(file, folder, (loaded) => {
      const overall = bytesDoneBeforeCurrent + loaded;
      const pct = totalBytes ? Math.min(100, Math.round((overall / totalBytes) * 100)) : 0;
      fill.style.width = `${pct}%`;
      label.textContent = `Uploading photo ${i + 1} of ${files.length}... ${pct}%`;
    });
    urls.push(url);
    bytesDoneBeforeCurrent += file.size;
  }

  fill.style.width = '100%';
  return urls;
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

// --- Change password ---

changePasswordBtn.addEventListener('click', () => {
  passwordForm.reset();
  passwordError.hidden = true;
  passwordSuccess.hidden = true;
  listView.hidden = true;
  editorView.hidden = true;
  passwordView.hidden = false;
  history.pushState({ adminView: 'password' }, '');
});

cancelPasswordBtn.addEventListener('click', () => {
  passwordView.hidden = true;
  listView.hidden = false;
});

passwordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  passwordError.hidden = true;
  passwordSuccess.hidden = true;

  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    passwordError.textContent = 'Passwords do not match.';
    passwordError.hidden = false;
    return;
  }

  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      passwordError.textContent = error.message;
      passwordError.hidden = false;
      return;
    }
    passwordForm.reset();
    passwordSuccess.hidden = false;
  } catch (err) {
    passwordError.textContent = `Request failed: ${err.message}`;
    passwordError.hidden = false;
  }
});

// --- List ---

let currentProjects = [];

async function loadProjects() {
  currentProjects = await adminFetch('/api/admin/projects');
  projectRows.innerHTML = currentProjects.map((p, i) => `
    <tr draggable="true" data-row-id="${p.id}">
      <td>
        <div class="admin-drag-handle" data-drag-handle title="Drag to reorder">&#9776;</div>
        <div class="admin-repeater-controls" style="flex-direction:row;">
          <button class="admin-btn admin-btn-ghost admin-btn-sm" data-reorder-up="${i}" ${i === 0 ? 'disabled' : ''}>&uarr;</button>
          <button class="admin-btn admin-btn-ghost admin-btn-sm" data-reorder-down="${i}" ${i === currentProjects.length - 1 ? 'disabled' : ''}>&darr;</button>
        </div>
      </td>
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

  projectRows.querySelectorAll('[data-reorder-up]').forEach(btn => {
    btn.addEventListener('click', () => reorderProject(+btn.dataset.reorderUp, -1));
  });
  projectRows.querySelectorAll('[data-reorder-down]').forEach(btn => {
    btn.addEventListener('click', () => reorderProject(+btn.dataset.reorderDown, 1));
  });

  wireProjectDragAndDrop();
}

async function persistProjectOrder(orderedProjects) {
  try {
    await Promise.all(orderedProjects.map((p, i) =>
      p.sort_order === i ? null : adminFetch(`/api/admin/projects/${p.id}`, { method: 'PUT', body: JSON.stringify({ sort_order: i }) })
    ));
    await loadProjects();
  } catch (err) {
    formError.textContent = err.message;
    formError.hidden = false;
  }
}

async function reorderProject(index, dir) {
  const otherIndex = index + dir;
  if (otherIndex < 0 || otherIndex >= currentProjects.length) return;

  const a = currentProjects[index];
  const b = currentProjects[otherIndex];
  const aOrder = a.sort_order;
  const bOrder = b.sort_order;

  try {
    await Promise.all([
      adminFetch(`/api/admin/projects/${a.id}`, { method: 'PUT', body: JSON.stringify({ sort_order: bOrder }) }),
      adminFetch(`/api/admin/projects/${b.id}`, { method: 'PUT', body: JSON.stringify({ sort_order: aOrder }) }),
    ]);
    await loadProjects();
  } catch (err) {
    formError.textContent = err.message;
    formError.hidden = false;
  }
}

// Desktop drag-and-drop reordering: grab any row (or the handle) and drop it
// where it should go, instead of walking it up/down one click at a time.
function wireProjectDragAndDrop() {
  let draggedId = null;

  const rows = () => Array.from(projectRows.querySelectorAll('tr'));

  rows().forEach(row => {
    row.addEventListener('dragstart', (e) => {
      draggedId = row.dataset.rowId;
      row.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
    });

    row.addEventListener('dragend', () => {
      row.classList.remove('is-dragging');
      rows().forEach(r => r.classList.remove('drag-over-top', 'drag-over-bottom'));
    });

    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (row.dataset.rowId === draggedId) return;
      const rect = row.getBoundingClientRect();
      const before = e.clientY < rect.top + rect.height / 2;
      row.classList.toggle('drag-over-top', before);
      row.classList.toggle('drag-over-bottom', !before);
    });

    row.addEventListener('dragleave', () => {
      row.classList.remove('drag-over-top', 'drag-over-bottom');
    });

    row.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetId = row.dataset.rowId;
      const before = row.classList.contains('drag-over-top');
      row.classList.remove('drag-over-top', 'drag-over-bottom');
      if (!draggedId || draggedId === targetId) return;

      const ordered = currentProjects.slice();
      const fromIndex = ordered.findIndex(p => p.id === draggedId);
      const [moved] = ordered.splice(fromIndex, 1);
      let toIndex = ordered.findIndex(p => p.id === targetId);
      if (!before) toIndex += 1;
      ordered.splice(toIndex, 0, moved);

      persistProjectOrder(ordered);
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
          <button type="button" class="admin-btn admin-btn-ghost admin-btn-sm" data-img-crop="${i}">Crop / Rotate</button>
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
  imagesList.querySelectorAll('[data-img-crop]').forEach(el => {
    el.addEventListener('click', () => {
      const i = +el.dataset.imgCrop;
      openCropper(images[i].url, async (croppedUrl) => {
        images[i].url = croppedUrl;
        renderImages();
      });
    });
  });
}

galleryInput.addEventListener('change', async () => {
  const files = Array.from(galleryInput.files);
  if (!files.length) return;
  const slug = document.getElementById('fSlug').value || 'untitled';

  galleryProgress.hidden = false;
  galleryProgressFill.style.width = '0%';

  try {
    const urls = await uploadFilesWithProgress(files, `projects/${slug}`, {
      fill: galleryProgressFill,
      label: galleryProgressLabel,
    });
    urls.forEach(url => images.push({ url, alt: '' }));
    renderImages();
  } catch (err) {
    formError.textContent = err.message;
    formError.hidden = false;
  } finally {
    galleryInput.value = '';
    setTimeout(() => { galleryProgress.hidden = true; }, 600);
  }
});

coverInput.addEventListener('change', async () => {
  const file = coverInput.files[0];
  if (!file) return;
  const slug = document.getElementById('fSlug').value || 'untitled';

  coverProgress.hidden = false;
  coverProgressFill.style.width = '0%';
  coverProgressLabel.textContent = 'Uploading...';

  try {
    coverImageUrl = await uploadFile(file, `projects/${slug}`, (loaded) => {
      const pct = file.size ? Math.min(100, Math.round((loaded / file.size) * 100)) : 0;
      coverProgressFill.style.width = `${pct}%`;
      coverProgressLabel.textContent = `Uploading... ${pct}%`;
    });
    coverPreview.src = coverImageUrl;
    coverPreview.hidden = false;
    cropCoverBtn.hidden = false;
  } catch (err) {
    formError.textContent = err.message;
    formError.hidden = false;
  } finally {
    coverInput.value = '';
    setTimeout(() => { coverProgress.hidden = true; }, 600);
  }
});

cropCoverBtn.addEventListener('click', () => {
  openCropper(coverImageUrl, async (croppedUrl) => {
    coverImageUrl = croppedUrl;
    coverPreview.src = croppedUrl;
  });
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
  document.getElementById('fPublished').checked = project ? project.is_published : true;
  document.getElementById('fCoverPosition').value = project?.cover_image_position || 'center center';
  document.getElementById('fOverviewKicker').value = project?.overview_kicker || '';
  document.getElementById('fOverviewHeading').value = project?.overview_heading || '';
  document.getElementById('fOverviewBody').value = project?.overview_body || '';

  coverImageUrl = project?.cover_image_url || '';
  coverPreview.src = coverImageUrl;
  coverPreview.hidden = !coverImageUrl;
  cropCoverBtn.hidden = !coverImageUrl;

  stats = (project?.project_stats || []).slice().sort((a, b) => a.sort_order - b.sort_order)
    .map(s => ({ value: s.value, label: s.label }));
  images = (project?.project_images || []).slice().sort((a, b) => a.sort_order - b.sort_order)
    .map(i => ({ url: i.url, alt: i.alt }));
  renderStats();
  renderImages();

  deleteProjectBtn.hidden = !project;
  listView.hidden = true;
  editorView.hidden = false;
  history.pushState({ adminView: 'editor' }, '');
}

function closeEditor() {
  editorView.hidden = true;
  listView.hidden = false;
  loadProjects();
}

// Pressing the browser's back button while editing a project should return
// to the project list instead of leaving /admin entirely.
window.addEventListener('popstate', () => {
  editorView.hidden = true;
  passwordView.hidden = true;
  listView.hidden = false;
  loadProjects();
});

// --- Tabs ---

let videosLoaded = false;
let backgroundsLoaded = false;

function showProjectsTab() {
  tabProjectsBtn.classList.add('active');
  tabVideosBtn.classList.remove('active');
  tabBackgroundsBtn.classList.remove('active');
  projectsSection.hidden = false;
  videosSection.hidden = true;
  backgroundsSection.hidden = true;
  passwordView.hidden = true;
}

function showVideosTab() {
  tabVideosBtn.classList.add('active');
  tabProjectsBtn.classList.remove('active');
  tabBackgroundsBtn.classList.remove('active');
  videosSection.hidden = false;
  projectsSection.hidden = true;
  backgroundsSection.hidden = true;
  passwordView.hidden = true;
  if (!videosLoaded) {
    videosLoaded = true;
    loadVideos();
  }
}

function showBackgroundsTab() {
  tabBackgroundsBtn.classList.add('active');
  tabProjectsBtn.classList.remove('active');
  tabVideosBtn.classList.remove('active');
  backgroundsSection.hidden = false;
  projectsSection.hidden = true;
  videosSection.hidden = true;
  passwordView.hidden = true;
  if (!backgroundsLoaded) {
    backgroundsLoaded = true;
    loadBackgrounds();
  }
}

tabProjectsBtn.addEventListener('click', showProjectsTab);
tabVideosBtn.addEventListener('click', showVideosTab);
tabBackgroundsBtn.addEventListener('click', showBackgroundsTab);

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

// --- Crop / rotate modal ---
// Reused for both the cover photo and any gallery photo. Loads the existing
// R2 image cross-origin (the bucket's CORS policy allows this), lets the
// admin drag/pinch to crop and rotate, then re-uploads the result as a new
// file and hands the new URL back via onSave.

let activeCropper = null;
let activeCropSave = null;
let activeCropSlug = 'untitled';

function openCropper(imageUrl, onSave) {
  activeCropSave = onSave;
  activeCropSlug = document.getElementById('fSlug').value || 'untitled';
  cropError.hidden = true;
  cropModal.hidden = false;

  // Cache-bust: images uploaded before the R2 bucket's CORS policy was set
  // may still be served from a stale edge cache without CORS headers, which
  // silently fails the crossOrigin load needed to export a cropped canvas.
  const separator = imageUrl.includes('?') ? '&' : '?';
  cropImage.crossOrigin = 'anonymous';
  cropImage.src = `${imageUrl}${separator}cb=${Date.now()}`;

  const start = () => {
    if (activeCropper) activeCropper.destroy();
    activeCropper = new Cropper(cropImage, {
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 1,
      background: false,
      responsive: true,
    });
  };

  if (cropImage.complete) start();
  else cropImage.onload = start;
}

function closeCropper() {
  if (activeCropper) {
    activeCropper.destroy();
    activeCropper = null;
  }
  cropModal.hidden = true;
  activeCropSave = null;
}

cropRotateLeft.addEventListener('click', () => activeCropper?.rotate(-90));
cropRotateRight.addEventListener('click', () => activeCropper?.rotate(90));
cropReset.addEventListener('click', () => activeCropper?.reset());
cropCancel.addEventListener('click', closeCropper);

cropSave.addEventListener('click', () => {
  if (!activeCropper) return;
  cropError.hidden = true;

  const canvas = activeCropper.getCroppedCanvas({ imageSmoothingQuality: 'high' });
  if (!canvas) {
    cropError.textContent = 'Could not read this image for cropping.';
    cropError.hidden = false;
    return;
  }

  canvas.toBlob(async (blob) => {
    if (!blob) {
      cropError.textContent = 'Could not export the cropped image.';
      cropError.hidden = false;
      return;
    }
    const file = new File([blob], `cropped-${Date.now()}.jpg`, { type: 'image/jpeg' });
    const onSave = activeCropSave;
    cropSave.disabled = true;
    try {
      const url = await uploadFile(file, `projects/${activeCropSlug}`);
      await onSave(url);
      closeCropper();
    } catch (err) {
      cropError.textContent = err.message;
      cropError.hidden = false;
    } finally {
      cropSave.disabled = false;
    }
  }, 'image/jpeg', 0.92);
});

// --- Videos ---

let currentVideos = [];

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}
newVideoDate.value = todayIsoDate();

function renderVideos() {
  videoRows.innerHTML = currentVideos.map((v, i) => `
    <tr>
      <td>
        <div class="admin-repeater-controls" style="flex-direction:row;">
          <button class="admin-btn admin-btn-ghost admin-btn-sm" data-video-up="${i}" ${i === 0 ? 'disabled' : ''}>&uarr;</button>
          <button class="admin-btn admin-btn-ghost admin-btn-sm" data-video-down="${i}" ${i === currentVideos.length - 1 ? 'disabled' : ''}>&darr;</button>
        </div>
      </td>
      <td>
        ${v.thumbnail_url
          ? `<img src="${escapeHtml(v.thumbnail_url)}" alt="">`
          : `<video src="${escapeHtml(v.video_url)}" muted preload="metadata"></video>`}
        <label class="admin-thumb-replace">
          Replace thumbnail
          <input type="file" accept="image/jpeg,image/png,image/webp" data-video-thumb-input="${v.id}" hidden>
        </label>
        <a class="admin-thumb-replace" href="#" data-video-thumb-reset="${v.id}">Reset to default</a>
      </td>
      <td><input type="text" value="${escapeHtml(v.title)}" data-video-title="${v.id}"></td>
      <td><input type="date" value="${escapeHtml(v.recorded_at)}" data-video-date="${v.id}"></td>
      <td class="admin-row-actions">
        <button class="admin-btn admin-btn-ghost admin-btn-sm" data-video-save="${v.id}">Save</button>
        <button class="admin-btn admin-btn-danger admin-btn-sm" data-video-delete="${v.id}">Delete</button>
      </td>
    </tr>
  `).join('');

  videoRows.querySelectorAll('[data-video-save]').forEach(btn => {
    btn.addEventListener('click', () => saveVideoRow(btn.dataset.videoSave));
  });
  videoRows.querySelectorAll('[data-video-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteVideo(btn.dataset.videoDelete));
  });
  videoRows.querySelectorAll('[data-video-up]').forEach(btn => {
    btn.addEventListener('click', () => reorderVideo(+btn.dataset.videoUp, -1));
  });
  videoRows.querySelectorAll('[data-video-down]').forEach(btn => {
    btn.addEventListener('click', () => reorderVideo(+btn.dataset.videoDown, 1));
  });
  videoRows.querySelectorAll('[data-video-thumb-input]').forEach(input => {
    input.addEventListener('change', () => replaceVideoThumbnail(input.dataset.videoThumbInput, input));
  });
  videoRows.querySelectorAll('[data-video-thumb-reset]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      resetVideoThumbnail(link.dataset.videoThumbReset);
    });
  });
}

async function loadVideos() {
  try {
    currentVideos = await adminFetch('/api/admin/videos');
    renderVideos();
  } catch (err) {
    videoFormError.textContent = err.message;
    videoFormError.hidden = false;
  }
}

async function saveVideoRow(id) {
  const title = videoRows.querySelector(`[data-video-title="${id}"]`).value;
  const recorded_at = videoRows.querySelector(`[data-video-date="${id}"]`).value;
  try {
    await adminFetch(`/api/admin/videos/${id}`, { method: 'PUT', body: JSON.stringify({ title, recorded_at }) });
    await loadVideos();
  } catch (err) {
    videoFormError.textContent = err.message;
    videoFormError.hidden = false;
  }
}

async function deleteVideo(id) {
  if (!confirm('Delete this video? This cannot be undone.')) return;
  try {
    await adminFetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
    await loadVideos();
  } catch (err) {
    videoFormError.textContent = err.message;
    videoFormError.hidden = false;
  }
}

async function reorderVideo(index, dir) {
  const otherIndex = index + dir;
  if (otherIndex < 0 || otherIndex >= currentVideos.length) return;
  const a = currentVideos[index];
  const b = currentVideos[otherIndex];
  try {
    await Promise.all([
      adminFetch(`/api/admin/videos/${a.id}`, { method: 'PUT', body: JSON.stringify({ sort_order: b.sort_order }) }),
      adminFetch(`/api/admin/videos/${b.id}`, { method: 'PUT', body: JSON.stringify({ sort_order: a.sort_order }) }),
    ]);
    await loadVideos();
  } catch (err) {
    videoFormError.textContent = err.message;
    videoFormError.hidden = false;
  }
}

// Grabs a frame from a local video file (before it's even uploaded) and
// returns it as a JPEG blob, so every video gets a real thumbnail by default.
function captureVideoFrame(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    // Some browsers won't reliably decode/seek a video that's never attached
    // to the document, even though metadata loading works fine detached.
    video.style.cssText = 'position:fixed; opacity:0; pointer-events:none; width:1px; height:1px;';
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.remove();
    };

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(1, (video.duration || 2) / 2);
    });
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        cleanup();
        if (blob) resolve(new File([blob], `thumb-${Date.now()}.jpg`, { type: 'image/jpeg' }));
        else reject(new Error('Could not generate a thumbnail from this video.'));
      }, 'image/jpeg', 0.85);
    });
    video.addEventListener('error', () => {
      cleanup();
      reject(new Error('Could not read this video to generate a thumbnail.'));
    });

    document.body.appendChild(video);
  });
}

async function replaceVideoThumbnail(id, input) {
  const file = input.files[0];
  if (!file) return;
  try {
    const thumbnail_url = await uploadFile(file, 'videos/thumbnails');
    await adminFetch(`/api/admin/videos/${id}`, { method: 'PUT', body: JSON.stringify({ thumbnail_url }) });
    await loadVideos();
  } catch (err) {
    videoFormError.textContent = err.message;
    videoFormError.hidden = false;
  }
}

// Same idea as captureVideoFrame, but grabs the frame from an already-hosted
// video URL instead of a local file — used to regenerate the default
// thumbnail for a video that already exists.
function captureVideoFrameFromUrl(url) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.style.cssText = 'position:fixed; opacity:0; pointer-events:none; width:1px; height:1px;';
    video.src = `${url}${url.includes('?') ? '&' : '?'}cb=${Date.now()}`;

    const cleanup = () => video.remove();

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(1, (video.duration || 2) / 2);
    });
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        cleanup();
        if (blob) resolve(new File([blob], `thumb-${Date.now()}.jpg`, { type: 'image/jpeg' }));
        else reject(new Error('Could not generate a thumbnail from this video.'));
      }, 'image/jpeg', 0.85);
    });
    video.addEventListener('error', () => {
      cleanup();
      reject(new Error('Could not read this video to generate a thumbnail.'));
    });

    document.body.appendChild(video);
  });
}

async function resetVideoThumbnail(id) {
  const record = currentVideos.find(v => v.id === id);
  if (!record) return;
  try {
    const frame = await captureVideoFrameFromUrl(record.video_url);
    const thumbnail_url = await uploadFile(frame, 'videos/thumbnails');
    await adminFetch(`/api/admin/videos/${id}`, { method: 'PUT', body: JSON.stringify({ thumbnail_url }) });
    await loadVideos();
  } catch (err) {
    videoFormError.textContent = err.message;
    videoFormError.hidden = false;
  }
}

addVideoBtn.addEventListener('click', async () => {
  videoFormError.hidden = true;
  const title = newVideoTitle.value.trim();
  const file = newVideoInput.files[0];
  const thumbFile = newVideoThumbnail.files[0];
  const recorded_at = newVideoDate.value || todayIsoDate();

  if (!title) {
    videoFormError.textContent = 'A title is required.';
    videoFormError.hidden = false;
    return;
  }
  if (!file) {
    videoFormError.textContent = 'Choose a video file to upload.';
    videoFormError.hidden = false;
    return;
  }

  addVideoBtn.disabled = true;
  videoUploadProgress.hidden = false;
  videoUploadProgressFill.style.width = '0%';
  videoUploadProgressLabel.textContent = 'Uploading...';

  try {
    const video_url = await uploadFile(file, 'videos', (loaded) => {
      const pct = file.size ? Math.min(100, Math.round((loaded / file.size) * 100)) : 0;
      videoUploadProgressFill.style.width = `${pct}%`;
      videoUploadProgressLabel.textContent = `Uploading... ${pct}%`;
    });

    let thumbnail_url = null;
    videoUploadProgressLabel.textContent = 'Generating thumbnail...';
    try {
      const thumbSource = thumbFile || await captureVideoFrame(file);
      thumbnail_url = await uploadFile(thumbSource, 'videos/thumbnails');
    } catch {
      // Non-fatal — the video still saves, just without a thumbnail.
    }

    await adminFetch('/api/admin/videos', {
      method: 'POST',
      body: JSON.stringify({ title, video_url, thumbnail_url, recorded_at }),
    });
    newVideoTitle.value = '';
    newVideoInput.value = '';
    newVideoThumbnail.value = '';
    newVideoDate.value = todayIsoDate();
    await loadVideos();
  } catch (err) {
    videoFormError.textContent = err.message;
    videoFormError.hidden = false;
  } finally {
    addVideoBtn.disabled = false;
    setTimeout(() => { videoUploadProgress.hidden = true; }, 600);
  }
});

// --- Backgrounds ---

async function loadBackgrounds() {
  try {
    const backgrounds = await adminFetch('/api/admin/backgrounds');
    backgroundRows.innerHTML = backgrounds.map(bg => `
      <div class="admin-bg-row">
        <div class="admin-bg-preview">
          ${bg.media_type === 'video'
            ? `<video src="${escapeHtml(bg.media_url)}" muted preload="metadata"></video>
               <button type="button" class="admin-bg-play-btn" data-bg-preview="${escapeHtml(bg.media_url)}" aria-label="Preview video">
                 <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
               </button>`
            : `<img src="${escapeHtml(bg.media_url)}" alt="">`}
        </div>
        <div class="admin-bg-info">
          <h4>${escapeHtml(bg.label)}</h4>
          <span class="admin-bg-type">${bg.media_type}</span>
          <div class="admin-bg-controls">
            <input type="file" accept="video/mp4,video/quicktime,video/webm,image/jpeg,image/png,image/webp" data-bg-input="${bg.page_key}">
          </div>
          <div class="admin-progress admin-bg-progress" data-bg-progress="${bg.page_key}" hidden>
            <div class="admin-progress-bar"><div class="admin-progress-fill" data-bg-progress-fill="${bg.page_key}"></div></div>
            <span class="admin-progress-label" data-bg-progress-label="${bg.page_key}"></span>
          </div>
        </div>
      </div>
    `).join('');

    backgroundRows.querySelectorAll('[data-bg-input]').forEach(input => {
      input.addEventListener('change', () => replaceBackground(input.dataset.bgInput, input));
    });
    backgroundRows.querySelectorAll('[data-bg-preview]').forEach(btn => {
      btn.addEventListener('click', () => openVideo(btn.dataset.bgPreview));
    });
  } catch (err) {
    backgroundFormError.textContent = err.message;
    backgroundFormError.hidden = false;
  }
}

async function replaceBackground(pageKey, input) {
  const file = input.files[0];
  if (!file) return;
  backgroundFormError.hidden = true;

  const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
  const progress = backgroundRows.querySelector(`[data-bg-progress="${pageKey}"]`);
  const progressFill = backgroundRows.querySelector(`[data-bg-progress-fill="${pageKey}"]`);
  const progressLabel = backgroundRows.querySelector(`[data-bg-progress-label="${pageKey}"]`);

  progress.hidden = false;
  progressFill.style.width = '0%';
  progressLabel.textContent = 'Uploading...';

  try {
    const media_url = await uploadFile(file, `backgrounds/${pageKey}`, (loaded) => {
      const pct = file.size ? Math.min(100, Math.round((loaded / file.size) * 100)) : 0;
      progressFill.style.width = `${pct}%`;
      progressLabel.textContent = `Uploading... ${pct}%`;
    });
    await adminFetch(`/api/admin/backgrounds/${pageKey}`, {
      method: 'PUT',
      body: JSON.stringify({ media_type: mediaType, media_url }),
    });
    await loadBackgrounds();
  } catch (err) {
    backgroundFormError.textContent = err.message;
    backgroundFormError.hidden = false;
    progress.hidden = true;
  }
}

refreshAuthView();
