import { init } from '../shared.js';
import { initStats } from '../features/stats.js';
import { applyPageBackground } from '../features/page-background.js';

init();
initStats('.sw-num');
applyPageBackground('sitework', { heroSelector: '.page-hero', mediaClass: 'ph-video', overlaySelector: '.ph-ov' });
