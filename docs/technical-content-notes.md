# Technical page source notes

The public-facing copy in `behind-the-slideshow.html` was checked against the McPics desktop repository's documentation, implementation, and commit history on September 11, 2026.

Reviewed desktop revision: `31efafe366142da82cf36f2ef78130485aa56d9c` (July 6, 2026, “Restart kiosk around display sleep”). The desktop repository was used only for reading. No desktop code, configuration, dependencies, or services were changed or run.

## Claim mapping

| Page topic | Reference evidence |
| --- | --- |
| Linux Mint, local Flask app, local photos, SQLite, and fullscreen browser | Desktop `README.md`, `app.py`, `requirements.txt`, and `scripts/launch-browser-kiosk.sh` |
| Never-shown priority, brief new-photo spotlight, recency-driven rotation, capped lifetime-count adjustment | `mcpics_scheduler.py`: `choose_next_photo`, `score_photo`; commit `79e2b0965af57b3c0a527d09345e53ab7322c78b` explains the catch-up bug |
| Exact and perceptual duplicate matching, stricter matching for distinct burst photos | `mcpics_duplicates.py`: `find_duplicate_match`; commit `09a69bc38dfe9bc29930c989907c48755b84ccc2` documents the false positive and the tradeoff |
| Highest-pixel-count canonical image and preserved contributor credit | `mcpics_duplicates.py`: `canonical_sort_key`, duplicate-group contributor handling; `scripts/import-email-photos.py` cross-sender exact-copy handling |
| Attachment filtering, HEIC conversion, low-resolution exclusion, optional batched replies | Desktop `README.md` sections “HEIC/HEIF email photos,” “Dropping low-resolution photos,” and “Automated replies”; `scripts/import-email-photos.py`: `process_message`, `hide_low_res_photo`, `save_converted_heic`, acknowledgment handling |
| Saved IMAP UID progress, safe quota retries, independent devices | Desktop `README.md` multi-device section; `scripts/import-email-photos.py`; commit `8ed4cb6bed5777b0790346295c9fbd30e296befa` documents the repeated-scan failure |
| Two-layer crossfade, delayed caption, error reporting and skip, fit without cropping | `app.py` photo-loading and transition logic and image-fit CSS at the reviewed desktop revision |
| Separate slideshow/support displays, optional targeted sleep/wake, backend/importer remain running | Desktop `README.md` NUC sections; `scripts/set-display-power.sh`, `scripts/install-startup.sh`; commits `6593af1fc7adf56ded9191f908945ae9c182a716` and `31efafe366142da82cf36f2ef78130485aa56d9c` |
| Startup sequencing, health check, remote-support delay, dependency installation outside startup | Desktop `README.md` startup/setup sections and `scripts/launch-browser-kiosk.sh` |

## Wording boundaries

- This is an explanation of repository-documented behavior, not an audit of the current running appliance. Local settings and runtime health were not inspected.
- Automatic replies, sender-balanced rotation, and display power scheduling are configurable. Do not describe all of them as universally enabled.
- The scheduler is scored and randomized within a candidate pool; it does not guarantee that every photo appears exactly once before any repeat.
- Stricter perceptual matching reduces a documented false positive; it does not guarantee perfect duplicate detection.
- Local playback means the computer serves already-imported photos from local storage. New email delivery still requires connectivity.
- Keep credentials, personal mailbox settings, home-directory paths, private source code, and machine-specific addresses out of the public page. No links to private source repositories are required in the visitor-facing content.
- Use the website's existing public submission address. Do not replace it with an address appearing in the desktop project's configuration examples.
- Preserve the user's original story and dated update history. The technical page adds context rather than rewriting historical entries.

## Preview and publishing

The page is a plain `.html` file with relative links, so extracting the branch ZIP and opening `index.html` works for both pages. The GitHub Pages preparation step explicitly includes the new HTML file. Source notes under `docs/` are not included in the deployed artifact.
