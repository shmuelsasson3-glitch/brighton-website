// Theater-mode video lightbox: clicking any video thumbnail opens a single
// shared overlay with the video centered at a large size (aspect ratio
// preserved, so portrait videos letterbox instead of stretching or cropping)
// against a dimmed, blurred backdrop — not the browser/OS's native fullscreen
// player. A real <video> element is used throughout so iOS's own native
// fullscreen and AirPlay controls keep working normally if the visitor taps
// our fullscreen button.

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

let openFn = null;

// Wires the lightbox's own controls (close, play/pause, progress, fullscreen).
// Call this once — these elements are static and persist across re-renders.
export function initVideoLightbox() {
  const lightbox = document.getElementById('videoLightbox');
  const video = document.getElementById('vlbVideo');
  if (!lightbox || !video) return;

  const closeBtn = document.getElementById('vlbClose');
  const centerBtn = lightbox.querySelector('[data-video-center-btn]');
  const barBtn = lightbox.querySelector('[data-video-bar-btn]');
  const progress = lightbox.querySelector('[data-video-progress]');
  const progressFill = lightbox.querySelector('[data-video-progress-fill]');
  const timeLabel = lightbox.querySelector('[data-video-time]');
  const fullscreenBtn = lightbox.querySelector('[data-video-fullscreen-btn]');

  function isMobile() {
    return window.matchMedia('(max-width: 700px)').matches;
  }

  function open(src) {
    video.src = src;
    video.play().catch(() => {});

    // On mobile, give the video the browser's own native control bar
    // (Apple's on iOS, Chrome's on Android) instead of our custom theater-
    // mode buttons, and also try to push it into true native fullscreen.
    // Setting `controls = true` is what actually guarantees a working
    // player regardless of platform — the fullscreen call on top of it is
    // a nice-to-have, not something the rest of the UI depends on.
    if (isMobile()) {
      video.controls = true;
      lightbox.classList.add('open', 'native-handoff');
      if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      else if (video.requestFullscreen) video.requestFullscreen().catch(() => {});
      return;
    }

    video.controls = false;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.controls = false;
    lightbox.classList.remove('open', 'native-handoff');
    document.body.style.overflow = '';
  }

  // Native players report their own dismissal separately from our overlay's
  // close button, so mirror that back into closing our (hidden-behind-it) overlay.
  video.addEventListener('webkitendfullscreen', () => { if (lightbox.classList.contains('open')) close(); });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isMobile() && lightbox.classList.contains('open')) close();
  });

  function togglePlay() {
    if (video.paused) video.play();
    else video.pause();
  }

  closeBtn?.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
  });

  centerBtn?.addEventListener('click', togglePlay);
  barBtn?.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);

  video.addEventListener('play', () => lightbox.classList.add('is-playing'));
  video.addEventListener('pause', () => lightbox.classList.remove('is-playing'));
  video.addEventListener('ended', () => lightbox.classList.remove('is-playing'));

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
    }
  });

  openFn = open;
}

// Wires click-to-open on video thumbnail cards. Call this after every
// re-render, since the cards themselves are freshly created each time.
export function wireVideoCards() {
  document.querySelectorAll('[data-open-video]').forEach(el => {
    el.addEventListener('click', () => openFn?.(el.dataset.videoSrc));
  });
}

// Opens the lightbox directly for a given video URL, without needing a
// [data-open-video] element in the DOM (e.g. an admin preview button).
export function openVideo(src) {
  openFn?.(src);
}
