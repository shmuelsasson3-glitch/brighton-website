import { init } from '../shared.js';
import { initVideoLightbox, wireVideoCards } from '../features/video-player.js';
import { supabase } from '../supabase-client.js';
import { applyPageBackground } from '../features/page-background.js';

init();
initVideoLightbox();
applyPageBackground('videos', { heroSelector: '.page-hero', mediaClass: 'ph-video', overlaySelector: '.ph-ov' });

const grid = document.getElementById('videosGrid');
const empty = document.getElementById('videosEmpty');
const sortSelect = document.getElementById('videoSort');

let videos = [];

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function videoCardHtml(video) {
  const thumb = video.thumbnail_url
    ? `<img src="${escapeHtml(video.thumbnail_url)}" alt="">`
    : '';

  return `
    <div class="video-card">
      <div class="video-thumb${thumb ? '' : ' video-thumb-fallback'}" data-open-video data-video-src="${escapeHtml(video.video_url)}">
        ${thumb}
        <button class="video-center-btn" aria-label="Play video">
          <svg class="icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
      <h3 class="video-title">${escapeHtml(video.title)}</h3>
    </div>
  `;
}

function render() {
  const sorted = videos.slice().sort((a, b) => {
    const diff = new Date(a.recorded_at) - new Date(b.recorded_at);
    return sortSelect.value === 'oldest' ? diff : -diff;
  });

  grid.innerHTML = sorted.map(videoCardHtml).join('');
  empty.hidden = sorted.length > 0;
  wireVideoCards();
}

sortSelect.addEventListener('change', render);

async function loadVideos() {
  if (!supabase) return;
  const { data, error } = await supabase.from('videos').select('*');
  if (error || !data) return;
  videos = data;
  render();
}

loadVideos();
