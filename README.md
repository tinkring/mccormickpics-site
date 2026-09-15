# McCormick Family Pictures

The family photo-sharing website at [mccormickpics.com](https://mccormickpics.com/), built with love for Grandma.

## What this website does

The home page helps family members email photos to the existing McPics upload address. It includes photo tips, the original project story, three recent updates, and an expandable archive of earlier dated updates. The send links open the visitor's email app; visitors still need to attach their photos and send the email. The copy button includes a manual fallback when clipboard access is unavailable.

The separate **Behind the slideshow** page explains the desktop architecture and six documented design challenges in a conversational, project-focused voice. It is linked from the main navigation, project story, and footer. Navigation remains available on mobile. Both footers include a return to the photo-sharing section rather than another email action.

Photo importing, email replies, slideshow playback, and the monitor schedule run on the existing McPics appliance. This repository does not implement or change those services, store submitted photos, or expose a public photo gallery.

## Files

- `index.html`: page content and update history.
- `behind-the-slideshow.html`: the desktop project's technical story, readable without JavaScript.
- `assets/site.css`: responsive styles and reduced-motion support.
- `assets/technical.css`: technical-page layouts and shared technical-page links.
- `assets/site.js`: progressive enhancements for copying the upload address, one-time entrance/reveal animations, and gentle desktop photo tilt.
- `assets/mcpics-wordmark.png`: existing McPics logo.
- `assets/grandma-about.jpeg`: existing portrait, displayed without cropping.
- `assets/family-memory-hero.png`: existing decorative room-and-photo-album image used in the story section; it is not a live view of Grandma's room.
- `assets/mcpics-social-2026-09.png`: branded link-preview artwork for messaging and social sharing.
- `CNAME`: the existing custom domain.
- `docs/technical-content-notes.md`: source references and accuracy boundaries for the technical page.
- `tests/check_site.py`: dependency-free content, link, history, and markup checks.

The site uses plain HTML, CSS, and JavaScript with system fonts. No package installation or build step is required. Navigation, email links, photo tips, the story, and update disclosures work without JavaScript.

The photo caption uses a local handwriting font when available, with a cursive fallback. All images and scripts are served from this repository. Motion is optional: content is visible by default, reveals play once, desktop tilt is limited to a fine mouse pointer, and changing the reduced-motion setting cancels running animations. Touch scrolling does not trigger tilt.

## Local preview

From this directory, run `python3 -m http.server 8000`, then open `http://localhost:8000`.

You can also download the preview branch ZIP, extract it, and open `index.html` directly in your browser.

Run `python3 tests/check_site.py` before publishing. Check phone and desktop layouts, keyboard navigation, the email links, clipboard success and manual fallback, expanding the archive and individual update entries, and returning to photo sharing from both footers. Check photo tilt with a mouse and the still layout with reduced motion enabled. The site itself cannot verify delivery to the slideshow.

## Editorial rules

- Keep the original family story, Grandma's photo, and established visual design unless a change is requested.
- Keep first-person reflection in the original family story. Elsewhere, focus on the photos, Grandma, and what McPics does; avoid repeated “I built,” “I changed,” or “I added” credits. Use “we” and “our” for the family, not an implied company or development team.
- Keep instructions practical. Let the original story carry the emotion instead of repeating its sentiments in every section.
- Write updates for family: what changed and what they will notice. Avoid reports about completed design tasks, excessive feature lists, or promotional claims.
- Keep all historical dates and their meaning. Shortening an entry is fine; do not move old work under a new date. Keep the archive label's count and date range accurate as entries move into it.
- Tell the technical story as problems encountered and changes made, while preserving documented behavior and relevant tradeoffs.
- Automatic replies are configurable, photo selection is weighted rather than a strict loop, and error recovery is not a guarantee that nothing can fail.
- Keep the public submission address, native HTML navigation, and expandable updates usable without JavaScript.

## Publishing

The existing `.github/workflows/pages.yml` workflow publishes pushes to `main` through GitHub Pages. It copies `index.html`, `behind-the-slideshow.html`, `CNAME`, `README.md`, and the entire `assets` directory into the deployment artifact. Branch changes can be reviewed in a pull request before merging to publish.

Keep the existing upload address, personal story, photos, and dated update history accurate when editing. Refer to Grandma only as “Grandma” in all public copy, and do not publish personal names, sender usernames, private contact details, locations, or machine-specific identifiers. Do not add backend capabilities or claims without verifying them against the slideshow project.

The desktop project was reviewed as a read-only reference for this page. All website changes belong in this repository.

## Link previews

Both pages include Open Graph and large-image social-card metadata directly in the HTML head. They share the McPics artwork but use page-specific titles, descriptions, and canonical URLs. Preview images use absolute URLs on the existing custom domain and are included by the workflow's assets copy step.

The new preview becomes available to messaging apps after the website changes are published. Opening a downloaded HTML file previews the page but does not update a messaging app's cached card. Existing message threads may retain older previews even after publication; the website cannot force a client to refresh a previously shared link.
