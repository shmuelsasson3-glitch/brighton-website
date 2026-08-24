import { supabase } from '../supabase-client.js';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

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
    <tr>
      <td>
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

refreshAuthView();
