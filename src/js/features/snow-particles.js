export function initSnowParticles(containerId = 'snowParticles') {
  const container = document.getElementById(containerId);
  if (!container) return;
  for (let i = 0; i < 28; i++) {
    const f = document.createElement('span');
    f.className = 'flake';
    f.textContent = '❄';
    f.style.left = Math.random() * 100 + '%';
    f.style.fontSize = (10 + Math.random() * 14) + 'px';
    f.style.opacity = 0.1 + Math.random() * 0.25;
    f.style.animationDuration = (8 + Math.random() * 14) + 's';
    f.style.animationDelay = (-Math.random() * 14) + 's';
    container.appendChild(f);
  }
}
