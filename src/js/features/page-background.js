import { supabase } from '../supabase-client.js';

// Swaps in whatever background (video or image) is configured for this page
// in the admin's Backgrounds tab. If nothing's set yet, or the fetch fails,
// the page's existing hardcoded background (already in the HTML) stays as-is.
export async function applyPageBackground(pageKey, { heroSelector, mediaClass, overlaySelector }) {
  if (!supabase) return;

  const { data, error } = await supabase
    .from('page_backgrounds')
    .select('*')
    .eq('page_key', pageKey)
    .single();
  if (error || !data) return;

  const hero = document.querySelector(heroSelector);
  if (!hero) return;

  const overlay = overlaySelector ? hero.querySelector(overlaySelector) : null;
  const existing = hero.querySelector(`.${mediaClass}`);

  let media;
  if (data.media_type === 'video') {
    media = document.createElement('video');
    media.autoplay = true;
    media.muted = true;
    media.loop = true;
    media.playsInline = true;
    media.innerHTML = `<source src="${data.media_url}" type="video/mp4">`;
  } else {
    media = document.createElement('img');
    media.src = data.media_url;
    media.alt = '';
  }
  media.className = mediaClass;

  if (overlay) hero.insertBefore(media, overlay);
  else hero.insertBefore(media, hero.firstChild);

  if (existing) existing.remove();
}
