import { init } from '../shared.js';
import { initStats } from '../features/stats.js';
import { applyPageBackground } from '../features/page-background.js';

init();
initStats('.ci-num');
applyPageBackground('commercial-installs', { heroSelector: '.page-hero', mediaClass: 'ph-video', overlaySelector: '.ph-ov' });
