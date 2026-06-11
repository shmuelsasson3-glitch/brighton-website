import '../css/main.css';
import { initNav } from './components/nav.js';
import { initAnimations } from './components/animations.js';
import { initSearch } from './features/search.js';
import { initGallery } from './features/gallery.js';
import { initWorkFilters } from './features/work-filters.js';
import { initStats } from './features/stats.js';
import { initMap } from './features/map.js';
import { initSnowParticles } from './features/snow-particles.js';

initNav();
initAnimations();
initSearch();
initGallery();
initWorkFilters();
initStats('.num, .sn-num, .cm-num, .sw-num, .ci-num');
initMap();
initSnowParticles();
