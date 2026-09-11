# McCormick Family Pictures

The family photo-sharing website at [mccormickpics.com](https://mccormickpics.com/), built with love for Grandma.

## What this website does

The page helps family members email photos to the existing McPics upload address. It includes photo tips, the project story, and the slideshow's update history. The send links open the visitor's email app; visitors still need to attach their photos and send the email. The copy button includes a manual fallback when clipboard access is unavailable.

Photo importing, email replies, slideshow playback, and the monitor schedule run on the existing McPics appliance. This repository does not implement or change those services, store submitted photos, or expose a public photo gallery.

## Files

- `index.html`: page content and update history.
- `assets/site.css`: responsive styles and reduced-motion support.
- `assets/site.js`: progressive enhancement for copying the upload address.
- `assets/mcpics-wordmark.png`: existing McPics logo.
- `assets/grandma-about.jpeg`: existing portrait, displayed without cropping.
- `CNAME`: the existing custom domain.

The site uses plain HTML, CSS, and JavaScript with system fonts. No package installation or build step is required. Navigation, email links, photo tips, the story, and update disclosures work without JavaScript.

## Local preview

From this directory, run `python3 -m http.server 8000`, then open `http://localhost:8000`.

Check phone and desktop layouts, keyboard navigation, the email links, clipboard success and manual fallback, and expanding update entries. The site itself cannot verify delivery to the slideshow.

## Publishing

The existing `.github/workflows/pages.yml` workflow publishes pushes to `main` through GitHub Pages. It copies `index.html`, `CNAME`, `README.md`, and the entire `assets` directory into the deployment artifact. Branch changes can be reviewed in a pull request before merging to publish.

Keep the existing upload address, personal story, photos, and dated update history accurate when editing. Do not add backend capabilities or claims without verifying them against the slideshow project.
