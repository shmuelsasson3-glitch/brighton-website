import { init } from '../shared.js';
import { applyPageBackground } from '../features/page-background.js';

init();
applyPageBackground('residential', { heroSelector: '.page-hero', mediaClass: 'ph-video', overlaySelector: '.ph-ov' });
