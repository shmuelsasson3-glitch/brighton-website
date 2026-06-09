import { init } from '../shared.js';
import { initStats } from '../features/stats.js';
import { initMap } from '../features/map.js';
import { initForm } from '../features/form.js';

init();
initStats('.num');
initMap();
initForm();
