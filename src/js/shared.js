import '../main.css';
import { initNav } from './components/nav.js';
import { initAnimations } from './components/animations.js';
import { initFooter } from './components/footer.js';
import { initSearch } from './features/search.js';

export const ASSET_BASE_URL = import.meta.env.VITE_ASSET_BASE_URL || '';

export function init(navOptions = {}) {
  initNav(navOptions);
  initAnimations();
  initFooter();
  initSearch();
}
