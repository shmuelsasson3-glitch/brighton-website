# Brighton Website

Static marketing site for Brighton Lawn & Landscape.

## Directory Structure

- Root `*.html` files are public pages. Keep them at root so existing URLs stay stable.
- `assets/css/` contains shared stylesheets.
- `assets/js/` contains shared JavaScript.
- `assets/images/` contains shared site images and logos.
- `assets/videos/` contains shared site videos.
- `projects/` contains project-specific gallery images, grouped by project slug.

## Conventions

- Keep shared styling in `assets/css/styles.css`.
- Keep shared browser behavior in `assets/js/search.js` or a focused shared script.
- Put new global media in `assets/images/` or `assets/videos/`.
- Put project-only media under `projects/<project-slug>/`.
- Keep page URLs stable unless redirects are handled elsewhere.
