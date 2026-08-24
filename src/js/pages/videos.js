import { init } from '../shared.js';
import { initVideoPlayers } from '../features/video-player.js';
import { supabase } from '../supabase-client.js';

init();

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
  return `
    <div class="video-card">
      <div class="video-player is-paused" data-video-player>
        <video playsinline preload="metadata" src="${escapeHtml(video.video_url)}"></video>
        <button class="video-center-btn" data-video-center-btn aria-label="Play video">
          <svg class="icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          <svg class="icon-pause" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
        </button>
        <div class="video-controls-bar">
          <button class="video-bar-btn" data-video-bar-btn aria-label="Play/Pause">
            <svg class="icon-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            <svg class="icon-pause" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
          </button>
          <div class="video-progress" data-video-progress>
            <div class="video-progress-fill" data-video-progress-fill></div>
          </div>
          <span class="video-time" data-video-time>0:00 / 0:00</span>
          <button class="video-fullscreen-btn" data-video-fullscreen-btn aria-label="Fullscreen">
            <svg viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18-5h-3a2 2 0 0 0-2 2v0m5 13h-3a2 2 0 0 1-2-2v0M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          </button>
        </div>
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
  initVideoPlayers();
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
