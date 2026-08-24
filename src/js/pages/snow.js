import { init } from '../shared.js';
import { initStats } from '../features/stats.js';
import { initSnowParticles } from '../features/snow-particles.js';
import { applyPageBackground } from '../features/page-background.js';

init({ variant: 'snow' });
initStats('.sn-num');
initSnowParticles();
applyPageBackground('snow', { heroSelector: '.page-hero', mediaClass: 'ph-video', overlaySelector: '.ph-ov' });
