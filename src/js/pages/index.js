import { init } from '../shared.js';
import { initStats } from '../features/stats.js';
import { initMap } from '../features/map.js';
import { initForm } from '../features/form.js';
import { applyPageBackground } from '../features/page-background.js';

init();
initStats('.num');
initMap();
initForm();
applyPageBackground('home', { heroSelector: '.hero', mediaClass: 'hero-video', overlaySelector: '.hero-overlay' });
