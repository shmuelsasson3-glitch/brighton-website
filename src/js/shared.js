import '../main.css';
import { initNav } from './components/nav.js';
import { initAnimations } from './components/animations.js';
import { initFooter } from './components/footer.js';
import { initSearch } from './features/search.js';

export function init(navOptions = {}) {
  initNav(navOptions);
  initAnimations();
  initFooter();
  initSearch();
}
