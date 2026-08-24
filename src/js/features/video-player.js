// Custom video player: real <video> elements (so iOS's native fullscreen
// and AirPlay behavior keeps working normally) with our own play/pause and
// progress UI layered on top, plus a shared registry so starting any video
// pauses whichever other one is currently playing.

const allVideos = [];

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function setupPlayer(root) {
  const video = root.querySelector('video');
  const centerBtn = root.querySelector('[data-video-center-btn]');
  const barBtn = root.querySelector('[data-video-bar-btn]');
  const progress = root.querySelector('[data-video-progress]');
  const progressFill = root.querySelector('[data-video-progress-fill]');
  const timeLabel = root.querySelector('[data-video-time]');
  const fullscreenBtn = root.querySelector('[data-video-fullscreen-btn]');
  if (!video) return;

  allVideos.push(video);

  function setPlayingState(isPlaying) {
    root.classList.toggle('is-playing', isPlaying);
    root.classList.toggle('is-paused', !isPlaying);
  }

  function togglePlay() {
    if (video.paused) video.play();
    else video.pause();
  }

  centerBtn?.addEventListener('click', togglePlay);
  barBtn?.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  video.addEventListener('play', () => {
    setPlayingState(true);
    for (const other of allVideos) {
      if (other !== video && !other.paused) other.pause();
    }
  });
  video.addEventListener('pause', () => setPlayingState(false));
  video.addEventListener('ended', () => setPlayingState(false));

  video.addEventListener('timeupdate', () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (timeLabel) timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
  });

  progress?.addEventListener('click', (e) => {
    if (!video.duration) return;
    const rect = progress.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    video.currentTime = ratio * video.duration;
  });

  fullscreenBtn?.addEventListener('click', () => {
    // iOS Safari doesn't support element.requestFullscreen() on <video>;
    // it has its own native fullscreen API instead.
    if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    } else if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (root.requestFullscreen) {
      root.requestFullscreen();
    }
  });
}

export function initVideoPlayers() {
  document.querySelectorAll('[data-video-player]').forEach(setupPlayer);
}
