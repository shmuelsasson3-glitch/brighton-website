import { init } from '../shared.js';
import { initStats } from '../features/stats.js';
import { initSnowParticles } from '../features/snow-particles.js';

init({ variant: 'snow' });
initStats('.sn-num');
initSnowParticles();
